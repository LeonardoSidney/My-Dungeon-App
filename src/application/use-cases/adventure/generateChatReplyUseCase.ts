import { Think } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ChatReplyStatus,
    ChatReplyStatusEnum,
    IChatReplyChannel,
    IStreamSessionRegistry,
    IIdGenerator,
    TurnPromptPurposeEnum,
} from '@domain/providers';
import { ITurnSpeakerService, ResolveTurnSpeakerReturn, TurnSpeaker, TurnSpeakerKindEnum } from '@domain/services';
import {
    ChatReplyConsumption,
    ChatReplyContextReturn,
    ChatReplyOutcome,
    ChatReplySession,
    ChatReplyStepReturn,
    ChatReplyStreamReturn,
    ChatReplyTurn,
    GenerateChatReplyUseCaseParams,
    GenerateChatReplyUseCaseReturn,
    HydratedAdventure,
    IDeleteChatAdventureUseCase,
    IDeleteChatVersionUseCase,
    IFinishStreamingChatUseCase,
    IGenerateChatReplyUseCase,
    IGetAdventureTemplatedPromptUseCase,
    IHydrateAdventureUseCase,
    INativeStreamCompletionUseCase,
    IStartStreamingChatUseCase,
    IUpdateStreamingChatUseCase,
} from '@domain/use-cases';
import { resolveSpeakerRuntime } from '@application/shared/resolveSpeakerRuntime';
import { parseThinkContent } from '@application/shared/parseThinkContent';

const DEFAULT_THROTTLE_MS = 100;
const ALREADY_REPLYING_ERROR = 'A reply is already being generated for this adventure';

export class GenerateChatReplyUseCase implements IGenerateChatReplyUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator,
        private readonly hydrateAdventureUseCase: IHydrateAdventureUseCase,
        private readonly turnSpeakerService: ITurnSpeakerService,
        private readonly getAdventureTemplatedPromptUseCase: IGetAdventureTemplatedPromptUseCase,
        private readonly nativeStreamCompletionUseCase: INativeStreamCompletionUseCase,
        private readonly startStreamingChatUseCase: IStartStreamingChatUseCase,
        private readonly updateStreamingChatUseCase: IUpdateStreamingChatUseCase,
        private readonly finishStreamingChatUseCase: IFinishStreamingChatUseCase,
        private readonly deleteChatAdventureUseCase: IDeleteChatAdventureUseCase,
        private readonly deleteChatVersionUseCase: IDeleteChatVersionUseCase,
        private readonly channel: IChatReplyChannel,
        private readonly registry: IStreamSessionRegistry,
        private readonly throttleMs: number = DEFAULT_THROTTLE_MS
    ) { }

    async execute (params: GenerateChatReplyUseCaseParams): Promise<GenerateChatReplyUseCaseReturn> {
        this.logger.info('Executing GenerateChatReplyUseCase::execute');
        this.logger.debug('GenerateChatReplyUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        if (this.registry.isActive(params.adventureId)) {
            return { success: false, error: ALREADY_REPLYING_ERROR };
        }

        const hydrated = await this.hydrateAdventureUseCase.execute({ adventureId: params.adventureId });
        if (!hydrated.success || !hydrated.hydrated) {
            return { success: false, error: hydrated.error ?? 'Failed to hydrate adventure' };
        }

        const speakerResponse = this.resolveFirstSpeaker(hydrated.hydrated, params);
        if (!speakerResponse.success) {
            return { success: false, error: speakerResponse.error ?? 'Failed to resolve the next speaker' };
        }

        if (!speakerResponse.speaker) {
            this.logger.debug('GenerateChatReplyUseCase::execute - waiting for the player characters to speak');
            return { success: true };
        }

        const turn = this.createTurn(params.adventureId);
        if (!this.registry.start(params.adventureId, turn.abort)) {
            return { success: false, error: ALREADY_REPLYING_ERROR };
        }

        const step = await this.startStep(turn, hydrated.hydrated, speakerResponse.speaker, params.chatId);
        if (!step.success || !step.session) {
            this.registry.release(params.adventureId);
            return { success: false, error: step.error ?? 'Failed to start assistant chat' };
        }

        this.notify(step.session, ChatReplyStatusEnum.STREAMING);
        this.runTurn(step.session);

        return { success: true, chatId: step.session.chat.id };
    }

    private resolveFirstSpeaker (hydrated: HydratedAdventure, params: GenerateChatReplyUseCaseParams): ResolveTurnSpeakerReturn {
        if (params.skipPlayerTurn) {
            return this.turnSpeakerService.resolveSkippedPlayersSpeaker(hydrated);
        }

        if (!params.chatId) {
            return this.turnSpeakerService.resolveNextSpeaker(hydrated);
        }

        const chat = hydrated.adventure.chat.find(c => c.id === params.chatId);
        if (!chat) {
            return { success: false, error: `Chat with id ${params.chatId} was not found` };
        }

        return this.turnSpeakerService.resolveChatSpeaker(hydrated, chat);
    }

    private createTurn (adventureId: string): ChatReplyTurn {
        let aborted = false;
        let abortCurrentCompletion: (() => void) | undefined;

        return {
            adventureId,
            isAborted: () => aborted,
            abort: () => {
                aborted = true;
                abortCurrentCompletion?.();
            },
            track: abortCompletion => {
                abortCurrentCompletion = abortCompletion;
                if (aborted) {
                    abortCompletion();
                }
            },
        };
    }

    private async startStep (
        turn: ChatReplyTurn,
        hydrated: HydratedAdventure,
        speaker: TurnSpeaker,
        chatId?: string
    ): Promise<ChatReplyStepReturn> {
        const runtime = resolveSpeakerRuntime(hydrated, speaker);
        if (!runtime) {
            return { success: false, error: `No assistant runtime found for ${speaker.name}` };
        }

        const started = await this.startStreamingChatUseCase.execute({
            adventureId: turn.adventureId,
            role: speaker.role,
            characterId: speaker.characterId,
            chatId,
            modelId: runtime.modelId,
        });
        if (!started.success || !started.chat) {
            return { success: false, error: started.error ?? 'Failed to start assistant chat' };
        }

        const chat = started.chat;
        const preservedThink = chat.think?.[chat.thinkIndex];
        const continuationBase = chatId ? chat.content[chat.index] ?? '' : '';
        const sessionThinkId = chatId && preservedThink ? preservedThink.id : this.idGenerator.generate();

        return {
            success: true,
            session: {
                adventureId: turn.adventureId,
                chat,
                speaker,
                runtime,
                continuationBase,
                sessionThinkId,
                hasPreservedThink: Boolean(preservedThink?.content),
                turn,
            },
        };
    }

    private async runTurn (firstSession: ChatReplySession): Promise<void> {
        let session = firstSession;
        let outcome = await this.runStep(session);

        while (this.continuesTurn(session, outcome)) {
            this.notify(session, ChatReplyStatusEnum.STREAMING);

            const next = await this.startNextStep(session.turn);
            if (!next.success) {
                outcome = { status: ChatReplyStatusEnum.FINISHED, error: next.error };
                break;
            }

            if (!next.session) {
                break;
            }

            session = next.session;
            this.notify(session, ChatReplyStatusEnum.STREAMING);
            outcome = await this.runStep(session);
        }

        this.registry.release(session.adventureId);
        this.notify(session, outcome.status, outcome.error);
    }

    private continuesTurn (session: ChatReplySession, outcome: ChatReplyOutcome): boolean {
        if (outcome.status !== ChatReplyStatusEnum.FINISHED || outcome.error) {
            return false;
        }

        if (session.turn.isAborted()) {
            return false;
        }

        return session.speaker.kind !== TurnSpeakerKindEnum.WORLD_MASTER;
    }

    private async startNextStep (turn: ChatReplyTurn): Promise<ChatReplyStepReturn> {
        const hydrated = await this.hydrateAdventureUseCase.execute({ adventureId: turn.adventureId });
        if (!hydrated.success || !hydrated.hydrated) {
            return { success: false, error: hydrated.error ?? 'Failed to hydrate adventure' };
        }

        const speakerResponse = this.turnSpeakerService.resolveNextSpeaker(hydrated.hydrated);
        if (!speakerResponse.success) {
            return { success: false, error: speakerResponse.error ?? 'Failed to resolve the next speaker' };
        }

        if (!speakerResponse.speaker) {
            return { success: true };
        }

        return this.startStep(turn, hydrated.hydrated, speakerResponse.speaker);
    }

    private async runStep (session: ChatReplySession): Promise<ChatReplyOutcome> {
        try {
            return await this.streamReply(session);
        } catch (error) {
            this.logger.error('GenerateChatReplyUseCase::runStep - reply failed unexpectedly', error);
            return { status: ChatReplyStatusEnum.FINISHED, error: 'Failed to generate the assistant reply' };
        }
    }

    private async streamReply (session: ChatReplySession): Promise<ChatReplyOutcome> {
        const stream = await this.startReplyStream(session);
        const consumption = await this.consumeReplyStream(session, stream);

        return this.saveReply(session, consumption);
    }

    private async startReplyStream (session: ChatReplySession): Promise<ChatReplyStreamReturn> {
        const hydrated = await this.hydrateAdventureUseCase.execute({ adventureId: session.adventureId });
        if (!hydrated.success || !hydrated.hydrated) {
            return { success: false, error: hydrated.error ?? 'Failed to hydrate adventure' };
        }

        const contextResponse = await this.generateContext(session, hydrated.hydrated);
        if (!contextResponse.success) {
            return { success: false, error: contextResponse.error };
        }

        if (session.turn.isAborted()) {
            return { success: false };
        }

        const prompt = await this.getAdventureTemplatedPromptUseCase.execute({
            hydrated: hydrated.hydrated,
            speaker: session.speaker,
            purpose: TurnPromptPurposeEnum.REPLY,
            context: contextResponse.context,
            targetChatId: session.chat.id,
        });
        if (!prompt.success || !prompt.prompt) {
            return { success: false, error: prompt.error ?? 'Failed to generate adventure text' };
        }

        return this.startCompletion(session, prompt.prompt);
    }

    private async generateContext (session: ChatReplySession, hydrated: HydratedAdventure): Promise<ChatReplyContextReturn> {
        const prompt = await this.getAdventureTemplatedPromptUseCase.execute({
            hydrated,
            speaker: session.speaker,
            purpose: TurnPromptPurposeEnum.CONTEXT,
            targetChatId: session.chat.id,
        });
        if (!prompt.success || !prompt.prompt) {
            return { success: false, error: prompt.error ?? 'Failed to generate the context prompt' };
        }

        const completion = await this.startCompletion(session, prompt.prompt);
        if (!completion.success || !completion.stream) {
            return { success: false, error: completion.error };
        }

        let text = '';
        try {
            for await (const token of completion.stream) {
                if (session.turn.isAborted()) break;
                text += token;
            }
        } catch (error) {
            this.logger.warning('GenerateChatReplyUseCase::generateContext - context stream interrupted', error);
            const interruption = error instanceof Error ? error.message : 'Context stream interrupted';
            return { success: false, error: interruption };
        }

        const context = parseThinkContent(text).content;
        this.logger.debug('GenerateChatReplyUseCase::generateContext - context generated', { speaker: session.speaker.name, context });

        return { success: true, context };
    }

    private async startCompletion (session: ChatReplySession, prompt: string): Promise<ChatReplyStreamReturn> {
        const completion = await this.nativeStreamCompletionUseCase.execute({
            adventureId: session.adventureId,
            connectionId: session.runtime.connectionId,
            samplerId: session.runtime.samplerId,
            modelId: session.runtime.modelId,
            prompt,
        });
        if (!completion.success || !completion.stream) {
            return { success: false, error: completion.error ?? 'Failed to start model stream' };
        }

        session.turn.track(() => completion.abort?.());

        return { success: true, stream: completion.stream };
    }

    private async consumeReplyStream (session: ChatReplySession, stream: ChatReplyStreamReturn): Promise<ChatReplyConsumption> {
        let currentText = session.continuationBase;
        if (!stream.success || !stream.stream) {
            return { text: currentText, interruption: stream.error };
        }

        let lastUpdateTime = Date.now();

        try {
            for await (const token of stream.stream) {
                if (session.turn.isAborted()) break;
                currentText += token;

                const now = Date.now();
                if (now - lastUpdateTime < this.throttleMs) continue;
                lastUpdateTime = now;

                const updated = await this.updateStreamingChatUseCase.execute({
                    adventureId: session.adventureId,
                    chatId: session.chat.id,
                    ...this.parse(session, currentText),
                });
                if (updated.success) {
                    this.notify(session, ChatReplyStatusEnum.STREAMING);
                }
            }
        } catch (error) {
            this.logger.warning('GenerateChatReplyUseCase::consumeReplyStream - model stream interrupted', error);
            const interruption = error instanceof Error ? error.message : 'Model stream interrupted';
            return { text: currentText, interruption };
        }

        return { text: currentText };
    }

    private async saveReply (session: ChatReplySession, consumption: ChatReplyConsumption): Promise<ChatReplyOutcome> {
        const { text, interruption } = consumption;

        if (!text.trim()) {
            const removed = session.chat.content.length > 1
                ? await this.deleteChatVersionUseCase.execute({
                    adventureId: session.adventureId,
                    chatId: session.chat.id,
                    versionIndex: session.chat.index,
                })
                : await this.deleteChatAdventureUseCase.execute({
                    adventureId: session.adventureId,
                    chatId: session.chat.id,
                });
            if (!removed.success) {
                this.logger.error('GenerateChatReplyUseCase::saveReply - failed to remove empty assistant chat', removed.error);
                return { status: ChatReplyStatusEnum.FINISHED, error: removed.error ?? 'Failed to remove empty assistant chat' };
            }

            return { status: ChatReplyStatusEnum.REMOVED, error: interruption };
        }

        const updated = await this.updateStreamingChatUseCase.execute({
            adventureId: session.adventureId,
            chatId: session.chat.id,
            ...this.parse(session, text),
        });
        if (!updated.success) {
            this.logger.error('GenerateChatReplyUseCase::saveReply - failed to save final assistant message', updated.error);
        }

        const finished = await this.finishStreamingChatUseCase.execute({
            adventureId: session.adventureId,
            chatId: session.chat.id,
        });
        if (!finished.success) {
            this.logger.error('GenerateChatReplyUseCase::saveReply - failed to finalize assistant chat', finished.error);
            return { status: ChatReplyStatusEnum.FINISHED, error: finished.error ?? 'Failed to finalize assistant chat' };
        }

        return { status: ChatReplyStatusEnum.FINISHED, error: interruption ?? (updated.success ? undefined : updated.error) };
    }

    private notify (session: ChatReplySession, status: ChatReplyStatus, error?: string): void {
        this.channel.publish({ adventureId: session.adventureId, chatId: session.chat.id, status, error });
    }

    private parse (session: ChatReplySession, text: string): { content: string; think?: Think; } {
        const { think, content } = parseThinkContent(text);

        if (think === undefined || session.hasPreservedThink) {
            return { content };
        }

        return { content, think: { id: session.sessionThinkId, content: think.content, enabled: true } };
    }

    private validate (params: GenerateChatReplyUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        if (params.skipPlayerTurn && params.chatId) {
            return 'The player turn cannot be skipped while continuing a chat';
        }

        return null;
    }
}
