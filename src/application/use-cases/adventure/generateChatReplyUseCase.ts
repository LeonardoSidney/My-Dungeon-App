import { RoleEnum, Think } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ChatReplyStatus, ChatReplyStatusEnum, IChatReplyChannel, IStreamSessionRegistry, IIdGenerator } from '@domain/providers';
import {
    ChatReplyOutcome,
    ChatReplySession,
    GenerateChatReplyUseCaseParams,
    GenerateChatReplyUseCaseReturn,
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
import { resolveWorldMasterRuntime } from '@application/shared/resolveWorldMasterRuntime';
import { parseThinkContent } from '@application/shared/parseThinkContent';

const DEFAULT_THROTTLE_MS = 100;
const ALREADY_REPLYING_ERROR = 'A reply is already being generated for this adventure';

export class GenerateChatReplyUseCase implements IGenerateChatReplyUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator,
        private readonly hydrateAdventureUseCase: IHydrateAdventureUseCase,
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

        const runtime = resolveWorldMasterRuntime(hydrated.hydrated);
        if (!runtime) {
            this.logger.warning('GenerateChatReplyUseCase::execute - no world master runtime, nothing to generate');
            return { success: true };
        }

        const text = await this.getAdventureTemplatedPromptUseCase.execute({ hydrated: hydrated.hydrated });
        if (!text.success || !text.prompt) {
            return { success: false, error: text.error ?? 'Failed to generate adventure text' };
        }

        const completion = await this.nativeStreamCompletionUseCase.execute({
            adventureId: params.adventureId,
            connectionId: runtime.connectionId,
            samplerId: runtime.samplerId,
            modelId: runtime.modelId,
            prompt: text.prompt,
        });
        if (!completion.success || !completion.stream) {
            return { success: false, error: completion.error ?? 'Failed to start model stream' };
        }

        let aborted = false;
        const abort = (): void => {
            aborted = true;
            completion.abort?.();
        };

        if (!this.registry.start(params.adventureId, abort)) {
            completion.abort?.();
            return { success: false, error: ALREADY_REPLYING_ERROR };
        }

        const started = await this.startStreamingChatUseCase.execute({
            adventureId: params.adventureId,
            role: RoleEnum.ASSISTANT,
            characterId: runtime.characterId,
            chatId: params.chatId,
        });
        if (!started.success || !started.chat) {
            this.registry.release(params.adventureId);
            completion.abort?.();
            return { success: false, error: started.error ?? 'Failed to start assistant chat' };
        }

        const chat = started.chat;
        const preservedThink = chat.think?.[chat.thinkIndex];
        const session: ChatReplySession = {
            adventureId: params.adventureId,
            chat,
            tokens: completion.stream,
            continuationBase: params.chatId ? chat.content[chat.index] ?? '' : '',
            sessionThinkId: params.chatId && preservedThink ? preservedThink.id : this.idGenerator.generate(),
            hasPreservedThink: Boolean(preservedThink?.content),
            isAborted: () => aborted,
        };

        this.notify(session, ChatReplyStatusEnum.STREAMING);
        this.runReply(session);

        return { success: true, chatId: chat.id };
    }

    private async runReply (session: ChatReplySession): Promise<void> {
        let outcome: ChatReplyOutcome;
        try {
            outcome = await this.streamReply(session);
        } catch (error) {
            this.logger.error('GenerateChatReplyUseCase::runReply - reply failed unexpectedly', error);
            outcome = { status: ChatReplyStatusEnum.FINISHED, error: 'Failed to generate the assistant reply' };
        }

        this.registry.release(session.adventureId);
        this.notify(session, outcome.status, outcome.error);
    }

    private async streamReply (session: ChatReplySession): Promise<ChatReplyOutcome> {
        let currentText = session.continuationBase;
        let lastUpdateTime = Date.now();
        let interruption: string | undefined;

        try {
            for await (const token of session.tokens) {
                if (session.isAborted()) break;
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
            this.logger.warning('GenerateChatReplyUseCase::streamReply - model stream interrupted', error);
            interruption = error instanceof Error ? error.message : 'Model stream interrupted';
        }

        if (!currentText.trim()) {
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
                this.logger.error('GenerateChatReplyUseCase::streamReply - failed to remove empty assistant chat', removed.error);
                return { status: ChatReplyStatusEnum.FINISHED, error: removed.error ?? 'Failed to remove empty assistant chat' };
            }

            return { status: ChatReplyStatusEnum.REMOVED, error: interruption };
        }

        const updated = await this.updateStreamingChatUseCase.execute({
            adventureId: session.adventureId,
            chatId: session.chat.id,
            ...this.parse(session, currentText),
        });
        if (!updated.success) {
            this.logger.error('GenerateChatReplyUseCase::streamReply - failed to save final assistant message', updated.error);
        }

        const finished = await this.finishStreamingChatUseCase.execute({
            adventureId: session.adventureId,
            chatId: session.chat.id,
        });
        if (!finished.success) {
            this.logger.error('GenerateChatReplyUseCase::streamReply - failed to finalize assistant chat', finished.error);
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

        return null;
    }
}
