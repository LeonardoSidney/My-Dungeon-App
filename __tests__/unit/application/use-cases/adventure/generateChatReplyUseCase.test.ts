import { GenerateChatReplyUseCase } from '@application/use-cases';
import { Chat, RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ChatReplyEvent, ChatReplyStatusEnum, TurnPromptPurposeEnum } from '@domain/providers';
import { TurnSpeaker, TurnSpeakerKindEnum } from '@domain/services';
import { GetAdventureTemplatedPromptUseCaseParams, HYDRATED_PARAM_KEY, HydratedAdventure } from '@domain/use-cases';
import { StreamSessionRegistry } from '@application/streaming';
import {
    createAdventureHelper,
    createAssistantHelper,
    createBackgroundExecutionHelper,
    createHydratedAdventureHelper,
} from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const NO_INTERMEDIATE_UPDATES = 60_000;
const CONTEXT_PROMPT = 'context prompt';
const REPLY_PROMPT = 'reply prompt';

const worldMasterSpeaker: TurnSpeaker = {
    kind: TurnSpeakerKindEnum.WORLD_MASTER,
    role: RoleEnum.ASSISTANT,
    characterId: '1',
    name: 'Master',
    assistantId: '1'
};

const clericSpeaker: TurnSpeaker = {
    kind: TurnSpeakerKindEnum.AI_CHARACTER,
    role: RoleEnum.AI_PERSONA,
    characterId: 'cleric',
    name: 'Cleric',
    assistantId: 'cleric-assistant'
};

type CompletionResult = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};

type TemplatedPromptResult = {
    success: boolean;
    prompt?: string;
    error?: string;
};

function createChat (overrides: Partial<Chat> = {}): Chat {
    const now = new Date();
    return {
        id: 'chat-1',
        role: RoleEnum.ASSISTANT,
        index: 0,
        thinkIndex: 0,
        content: [''],
        characterId: '1',
        isStreaming: true,
        createdAt: now,
        updatedAt: now,
        ...overrides
    };
}

function createHydrated (chat: Chat[] = []): HydratedAdventure {
    const base = createHydratedAdventureHelper({ adventure: { chat } });
    const clericAssistant = createAssistantHelper({
        id: 'cleric-assistant',
        connectionId: '1',
        modelId: 'cleric-model',
        samplerId: 'cleric-sampler'
    });

    return { ...base, assistants: { ...base.assistants, [clericAssistant.id]: clericAssistant } };
}

function asyncTokens (tokens: string[]) {
    return (async function* () {
        for (const token of tokens) {
            yield token;
        }
    })();
}

function controllableTokens () {
    const pending: Array<(result: IteratorResult<string>) => void> = [];
    const queued: Array<IteratorResult<string>> = [];
    const settle = (result: IteratorResult<string>) => {
        const resolve = pending.shift();
        if (resolve) {
            resolve(result);
            return;
        }
        queued.push(result);
    };

    return {
        push: (token: string) => settle({ value: token, done: false }),
        end: () => settle({ value: undefined, done: true }),
        stream: {
            [Symbol.asyncIterator]: () => ({
                next: () => new Promise<IteratorResult<string>>(resolve => {
                    const result = queued.shift();
                    if (result) {
                        resolve(result);
                        return;
                    }
                    pending.push(resolve);
                })
            })
        }
    };
}

function failingTokens (tokens: string[], error: unknown) {
    return (async function* () {
        for (const token of tokens) {
            yield token;
        }
        throw error;
    })();
}

function waitForBackgroundWork (): Promise<void> {
    return new Promise<void>(resolve => setImmediate(() => resolve()));
}

function buildMocks (tokens: string[] = ['Hello', ' world'], chat: Chat = createChat()) {
    const startedAdventure = createAdventureHelper({ chat: [chat] });
    const removedAdventure = createAdventureHelper({ chat: [] });
    const abortStream = jest.fn();
    const abortContext = jest.fn();

    const completions: { context: () => CompletionResult; reply: () => CompletionResult; } = {
        context: () => ({ success: true, stream: asyncTokens(['scene context']), abort: abortContext }),
        reply: () => ({ success: true, stream: asyncTokens(tokens), abort: abortStream })
    };
    const templatedPrompts: { context: TemplatedPromptResult; reply: TemplatedPromptResult; } = {
        context: { success: true, prompt: CONTEXT_PROMPT },
        reply: { success: true, prompt: REPLY_PROMPT }
    };

    const events: ChatReplyEvent[] = [];
    let settle: () => void = () => undefined;
    const settled = new Promise<void>(resolve => { settle = resolve; });
    const channel = {
        publish: jest.fn((event: ChatReplyEvent) => {
            events.push(event);
            if (event.status !== ChatReplyStatusEnum.STREAMING) settle();
        }),
        subscribe: jest.fn()
    };

    const resolveCompletion = async (params: { prompt: string; }): Promise<CompletionResult> => {
        if (params.prompt === CONTEXT_PROMPT) {
            return completions.context();
        }

        return completions.reply();
    };

    const resolveTemplatedPrompt = async (params: GetAdventureTemplatedPromptUseCaseParams): Promise<TemplatedPromptResult> => {
        if (HYDRATED_PARAM_KEY in params && params.purpose === TurnPromptPurposeEnum.CONTEXT) {
            return templatedPrompts.context;
        }

        return templatedPrompts.reply;
    };

    return {
        startedAdventure,
        removedAdventure,
        abortStream,
        abortContext,
        completions,
        templatedPrompts,
        events,
        settled,
        channel,
        registry: new StreamSessionRegistry(createBackgroundExecutionHelper()),
        hydrate: { execute: jest.fn().mockResolvedValue({ success: true, hydrated: createHydrated() }) },
        turnSpeaker: {
            resolveNextSpeaker: jest.fn().mockReturnValue({ success: true, speaker: worldMasterSpeaker }),
            resolveChatSpeaker: jest.fn().mockReturnValue({ success: true, speaker: worldMasterSpeaker }),
            resolveWorldMaster: jest.fn().mockReturnValue({ success: true, speaker: worldMasterSpeaker })
        },
        getTemplatedPrompt: { execute: jest.fn(resolveTemplatedPrompt) },
        nativeStream: { execute: jest.fn(resolveCompletion) },
        startStreaming: { execute: jest.fn().mockResolvedValue({ success: true, chat, adventure: startedAdventure }) },
        updateStreaming: { execute: jest.fn().mockResolvedValue({ success: true }) },
        finishStreaming: { execute: jest.fn().mockResolvedValue({ success: true }) },
        deleteChat: { execute: jest.fn().mockResolvedValue({ success: true, adventure: removedAdventure }) },
        deleteChatVersion: { execute: jest.fn().mockResolvedValue({ success: true, adventure: removedAdventure }) },
        idGenerator: { generate: jest.fn().mockReturnValue('think-session') }
    };
}

function buildUseCase (mocks: ReturnType<typeof buildMocks>, throttleMs = NO_INTERMEDIATE_UPDATES) {
    return new GenerateChatReplyUseCase(
        mockLogger,
        mocks.idGenerator,
        mocks.hydrate,
        mocks.turnSpeaker,
        mocks.getTemplatedPrompt,
        mocks.nativeStream,
        mocks.startStreaming,
        mocks.updateStreaming,
        mocks.finishStreaming,
        mocks.deleteChat,
        mocks.deleteChatVersion,
        mocks.channel,
        mocks.registry,
        throttleMs
    );
}

describe('GenerateChatReplyUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the chat id of the speaker right away and persists the reply in the background', async () => {
        const mocks = buildMocks();

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(response).toEqual({ success: true, chatId: 'chat-1' });
        expect(mocks.hydrate.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1' });
        expect(mocks.startStreaming.execute).toHaveBeenCalledWith({
            adventureId: 'adventure-1',
            role: RoleEnum.ASSISTANT,
            characterId: '1',
            chatId: undefined,
            modelId: '1'
        });
        expect(mocks.updateStreaming.execute).toHaveBeenCalledTimes(1);
        expect(mocks.updateStreaming.execute).toHaveBeenCalledWith({
            adventureId: 'adventure-1',
            chatId: 'chat-1',
            content: 'Hello world'
        });
        expect(mocks.finishStreaming.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(mocks.events).toEqual([
            { adventureId: 'adventure-1', chatId: 'chat-1', status: ChatReplyStatusEnum.STREAMING, error: undefined },
            { adventureId: 'adventure-1', chatId: 'chat-1', status: ChatReplyStatusEnum.FINISHED, error: undefined }
        ]);
    });

    it('asks for the context prompt of the speaker before the reply', async () => {
        const mocks = buildMocks();

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.getTemplatedPrompt.execute).toHaveBeenNthCalledWith(1, {
            hydrated: expect.anything(),
            speaker: worldMasterSpeaker,
            purpose: TurnPromptPurposeEnum.CONTEXT,
            targetChatId: 'chat-1'
        });
    });

    it('generates the context with the model of the speaker', async () => {
        const mocks = buildMocks();

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.nativeStream.execute).toHaveBeenNthCalledWith(1, {
            adventureId: 'adventure-1',
            connectionId: '1',
            samplerId: '1',
            modelId: '1',
            prompt: CONTEXT_PROMPT
        });
    });

    it('builds the reply prompt with the generated context', async () => {
        const mocks = buildMocks();

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.getTemplatedPrompt.execute).toHaveBeenNthCalledWith(2, {
            hydrated: expect.anything(),
            speaker: worldMasterSpeaker,
            purpose: TurnPromptPurposeEnum.REPLY,
            context: 'scene context',
            targetChatId: 'chat-1'
        });
        expect(mocks.nativeStream.execute).toHaveBeenNthCalledWith(2, expect.objectContaining({ prompt: REPLY_PROMPT }));
    });

    it('drops the thought of the model from the generated context', async () => {
        const mocks = buildMocks();
        mocks.completions.context = () => ({ success: true, stream: asyncTokens(['weighing the scene', '</think>', 'The party rests']), abort: mocks.abortContext });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.getTemplatedPrompt.execute).toHaveBeenNthCalledWith(2, expect.objectContaining({ context: 'The party rests' }));
    });

    it('generates the context and the reply of an AI character with the assistant of the character', async () => {
        const mocks = buildMocks(['Hello'], createChat({ role: RoleEnum.AI_PERSONA, characterId: 'cleric' }));
        mocks.turnSpeaker.resolveNextSpeaker
            .mockReturnValueOnce({ success: true, speaker: clericSpeaker })
            .mockReturnValueOnce({ success: true });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.startStreaming.execute).toHaveBeenCalledWith(expect.objectContaining({
            role: RoleEnum.AI_PERSONA,
            characterId: 'cleric',
            modelId: 'cleric-model'
        }));
        expect(mocks.nativeStream.execute).toHaveBeenNthCalledWith(1, expect.objectContaining({ modelId: 'cleric-model', samplerId: 'cleric-sampler' }));
        expect(mocks.nativeStream.execute).toHaveBeenNthCalledWith(2, expect.objectContaining({ modelId: 'cleric-model', samplerId: 'cleric-sampler' }));
    });

    it('gives the turn to the next speaker after an AI character replies', async () => {
        const clericChat = createChat({ id: 'cleric-chat', role: RoleEnum.AI_PERSONA, characterId: 'cleric' });
        const masterChat = createChat({ id: 'master-chat' });
        const mocks = buildMocks(['Hello'], clericChat);
        mocks.turnSpeaker.resolveNextSpeaker
            .mockReturnValueOnce({ success: true, speaker: clericSpeaker })
            .mockReturnValueOnce({ success: true, speaker: worldMasterSpeaker });
        mocks.startStreaming.execute
            .mockResolvedValueOnce({ success: true, chat: clericChat })
            .mockResolvedValueOnce({ success: true, chat: masterChat });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(response).toEqual({ success: true, chatId: 'cleric-chat' });
        expect(mocks.startStreaming.execute).toHaveBeenNthCalledWith(2, {
            adventureId: 'adventure-1',
            role: RoleEnum.ASSISTANT,
            characterId: '1',
            chatId: undefined,
            modelId: '1'
        });
        expect(mocks.finishStreaming.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'cleric-chat' });
        expect(mocks.finishStreaming.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'master-chat' });
    });

    it('keeps the turn streaming between its steps and finishes it on the last one', async () => {
        const clericChat = createChat({ id: 'cleric-chat', role: RoleEnum.AI_PERSONA, characterId: 'cleric' });
        const masterChat = createChat({ id: 'master-chat' });
        const mocks = buildMocks(['Hello'], clericChat);
        mocks.turnSpeaker.resolveNextSpeaker
            .mockReturnValueOnce({ success: true, speaker: clericSpeaker })
            .mockReturnValueOnce({ success: true, speaker: worldMasterSpeaker });
        mocks.startStreaming.execute
            .mockResolvedValueOnce({ success: true, chat: clericChat })
            .mockResolvedValueOnce({ success: true, chat: masterChat });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events.map(event => [event.chatId, event.status])).toEqual([
            ['cleric-chat', ChatReplyStatusEnum.STREAMING],
            ['cleric-chat', ChatReplyStatusEnum.STREAMING],
            ['master-chat', ChatReplyStatusEnum.STREAMING],
            ['master-chat', ChatReplyStatusEnum.FINISHED]
        ]);
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('ends the turn after the world master replies', async () => {
        const mocks = buildMocks();

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.turnSpeaker.resolveNextSpeaker).toHaveBeenCalledTimes(1);
        expect(mocks.startStreaming.execute).toHaveBeenCalledTimes(1);
    });

    it('ends the turn on the AI character step when no one else has to speak', async () => {
        const mocks = buildMocks(['Hello'], createChat({ role: RoleEnum.AI_PERSONA, characterId: 'cleric' }));
        mocks.turnSpeaker.resolveNextSpeaker
            .mockReturnValueOnce({ success: true, speaker: clericSpeaker })
            .mockReturnValueOnce({ success: true });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.startStreaming.execute).toHaveBeenCalledTimes(1);
        expect(mocks.events[mocks.events.length - 1]).toEqual({ adventureId: 'adventure-1', chatId: 'chat-1', status: ChatReplyStatusEnum.FINISHED, error: undefined });
    });

    it('ends the turn with the error when the next speaker cannot be resolved', async () => {
        const mocks = buildMocks(['Hello'], createChat({ role: RoleEnum.AI_PERSONA, characterId: 'cleric' }));
        mocks.turnSpeaker.resolveNextSpeaker
            .mockReturnValueOnce({ success: true, speaker: clericSpeaker })
            .mockReturnValueOnce({ success: false, error: 'AI controlled character not found: necromancer' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({
            status: ChatReplyStatusEnum.FINISHED,
            error: 'AI controlled character not found: necromancer'
        }));
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('ends the turn with the error when the adventure cannot be hydrated for the next speaker', async () => {
        const mocks = buildMocks(['Hello'], createChat({ role: RoleEnum.AI_PERSONA, characterId: 'cleric' }));
        mocks.turnSpeaker.resolveNextSpeaker.mockReturnValueOnce({ success: true, speaker: clericSpeaker });
        mocks.hydrate.execute
            .mockResolvedValueOnce({ success: true, hydrated: createHydrated() })
            .mockResolvedValueOnce({ success: true, hydrated: createHydrated() })
            .mockResolvedValueOnce({ success: false, error: 'storage failed' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.FINISHED, error: 'storage failed' }));
    });

    it('does not give the turn to the next speaker when an AI character step fails', async () => {
        const mocks = buildMocks(['Hello'], createChat({ role: RoleEnum.AI_PERSONA, characterId: 'cleric' }));
        mocks.turnSpeaker.resolveNextSpeaker.mockReturnValueOnce({ success: true, speaker: clericSpeaker });
        mocks.finishStreaming.execute.mockResolvedValue({ success: false, error: 'storage full' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.turnSpeaker.resolveNextSpeaker).toHaveBeenCalledTimes(1);
        expect(mocks.startStreaming.execute).toHaveBeenCalledTimes(1);
    });

    it('does not give the turn to the next speaker when an AI character returns nothing', async () => {
        const mocks = buildMocks([], createChat({ role: RoleEnum.AI_PERSONA, characterId: 'cleric' }));
        mocks.turnSpeaker.resolveNextSpeaker.mockReturnValueOnce({ success: true, speaker: clericSpeaker });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.startStreaming.execute).toHaveBeenCalledTimes(1);
        expect(mocks.events[mocks.events.length - 1].status).toBe(ChatReplyStatusEnum.REMOVED);
    });

    it('does not give the turn to the next speaker when the AI character step is stopped', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks(['Hello'], createChat({ role: RoleEnum.AI_PERSONA, characterId: 'cleric' }));
        mocks.turnSpeaker.resolveNextSpeaker.mockReturnValueOnce({ success: true, speaker: clericSpeaker });
        mocks.completions.reply = () => ({ success: true, stream: tokens.stream, abort: mocks.abortStream });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        tokens.push('first');
        await waitForBackgroundWork();
        mocks.registry.stop('adventure-1');
        tokens.push(' second');
        await mocks.settled;

        expect(mocks.startStreaming.execute).toHaveBeenCalledTimes(1);
        expect(mocks.events[mocks.events.length - 1].status).toBe(ChatReplyStatusEnum.FINISHED);
    });

    it('publishes an update after each intermediate save', async () => {
        const mocks = buildMocks(['a', 'b', 'c']);

        await buildUseCase(mocks, 0).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.updateStreaming.execute).toHaveBeenCalledTimes(4);
        expect(mocks.events.map(event => event.status)).toEqual([
            ChatReplyStatusEnum.STREAMING,
            ChatReplyStatusEnum.STREAMING,
            ChatReplyStatusEnum.STREAMING,
            ChatReplyStatusEnum.STREAMING,
            ChatReplyStatusEnum.FINISHED
        ]);
    });

    it('keeps the adventure marked as replying until the turn settles', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks();
        mocks.completions.reply = () => ({ success: true, stream: tokens.stream, abort: mocks.abortStream });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        expect(mocks.registry.isActive('adventure-1')).toBe(true);

        tokens.push('Hi');
        tokens.end();
        await mocks.settled;

        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('rejects a second reply while a turn is still being generated for the adventure', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks();
        mocks.completions.reply = () => ({ success: true, stream: tokens.stream, abort: mocks.abortStream });
        const useCase = buildUseCase(mocks);

        await useCase.execute({ adventureId: 'adventure-1' });
        const second = await useCase.execute({ adventureId: 'adventure-1' });

        expect(second).toEqual({ success: false, error: 'A reply is already being generated for this adventure' });
        expect(mocks.startStreaming.execute).toHaveBeenCalledTimes(1);

        tokens.end();
        await mocks.settled;
    });

    it('fails validation without an adventure id', async () => {
        const mocks = buildMocks();

        const response = await buildUseCase(mocks).execute({ adventureId: ' ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(mocks.hydrate.execute).not.toHaveBeenCalled();
    });

    it('succeeds without a chat while the turn waits for the player characters', async () => {
        const mocks = buildMocks();
        mocks.turnSpeaker.resolveNextSpeaker.mockReturnValue({ success: true });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true });
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
        expect(mocks.nativeStream.execute).not.toHaveBeenCalled();
        expect(mocks.channel.publish).not.toHaveBeenCalled();
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('fails without starting a chat when the next speaker cannot be resolved', async () => {
        const mocks = buildMocks();
        mocks.turnSpeaker.resolveNextSpeaker.mockReturnValue({ success: false, error: 'WorldMaster not found' });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'WorldMaster not found' });
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
    });

    it('fails with a generic error when the next speaker fails without a message', async () => {
        const mocks = buildMocks();
        mocks.turnSpeaker.resolveNextSpeaker.mockReturnValue({ success: false });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Failed to resolve the next speaker' });
    });

    it('fails without starting a chat when the speaker has no assistant runtime', async () => {
        const mocks = buildMocks();
        mocks.hydrate.execute.mockResolvedValue({ success: true, hydrated: { ...createHydrated(), assistants: {} } });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'No assistant runtime found for Master' });
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('releases the adventure without publishing when the speaker chat cannot be started', async () => {
        const mocks = buildMocks();
        mocks.startStreaming.execute.mockResolvedValue({ success: false, error: 'storage failed' });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'storage failed' });
        expect(mocks.nativeStream.execute).not.toHaveBeenCalled();
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
        expect(mocks.channel.publish).not.toHaveBeenCalled();
    });

    it('fails with a generic error when the speaker chat cannot be started without a message', async () => {
        const mocks = buildMocks();
        mocks.startStreaming.execute.mockResolvedValue({ success: false });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Failed to start assistant chat' });
    });

    it('fails without starting a chat when another reply claims the adventure first', async () => {
        const mocks = buildMocks();
        const registry = { isActive: jest.fn().mockReturnValue(false), start: jest.fn().mockReturnValue(false), release: jest.fn(), stop: jest.fn() };
        const useCase = new GenerateChatReplyUseCase(
            mockLogger,
            mocks.idGenerator,
            mocks.hydrate,
            mocks.turnSpeaker,
            mocks.getTemplatedPrompt,
            mocks.nativeStream,
            mocks.startStreaming,
            mocks.updateStreaming,
            mocks.finishStreaming,
            mocks.deleteChat,
            mocks.deleteChatVersion,
            mocks.channel,
            registry as never,
            NO_INTERMEDIATE_UPDATES
        );

        const response = await useCase.execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'A reply is already being generated for this adventure' });
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
    });

    it('fails with the hydration error without starting a chat', async () => {
        const mocks = buildMocks();
        mocks.hydrate.execute.mockResolvedValue({ success: false, error: 'adventure missing' });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'adventure missing' });
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
    });

    it('fails with a generic error when hydration returns no adventure', async () => {
        const mocks = buildMocks();
        mocks.hydrate.execute.mockResolvedValue({ success: true });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Failed to hydrate adventure' });
    });

    it('removes the empty chat and reports the error when the context prompt cannot be built', async () => {
        const mocks = buildMocks();
        mocks.templatedPrompts.context = { success: false, error: 'context prompt failed' };

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.nativeStream.execute).not.toHaveBeenCalled();
        expect(mocks.deleteChat.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.REMOVED, error: 'context prompt failed' }));
    });

    it('reports a generic error when the context prompt fails without a message', async () => {
        const mocks = buildMocks();
        mocks.templatedPrompts.context = { success: false };

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Failed to generate the context prompt');
    });

    it('removes the empty chat and reports the error when the context stream cannot start', async () => {
        const mocks = buildMocks();
        mocks.completions.context = () => ({ success: false, error: 'model unavailable' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.getTemplatedPrompt.execute).toHaveBeenCalledTimes(1);
        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.REMOVED, error: 'model unavailable' }));
    });

    it('removes the empty chat and reports the error when the context stream breaks', async () => {
        const mocks = buildMocks();
        mocks.completions.context = () => ({ success: true, stream: failingTokens(['partial'], new Error('Request failed with status 500')), abort: mocks.abortContext });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.getTemplatedPrompt.execute).toHaveBeenCalledTimes(1);
        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({
            status: ChatReplyStatusEnum.REMOVED,
            error: 'Request failed with status 500'
        }));
    });

    it('reports a generic interruption when the context stream throws a non Error value', async () => {
        const mocks = buildMocks();
        mocks.completions.context = () => ({ success: true, stream: failingTokens([], 'connection reset'), abort: mocks.abortContext });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Context stream interrupted');
    });

    it('removes the empty chat and reports the error when the reply prompt cannot be built', async () => {
        const mocks = buildMocks();
        mocks.templatedPrompts.reply = { success: false, error: 'prompt failed' };

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.nativeStream.execute).toHaveBeenCalledTimes(1);
        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.REMOVED, error: 'prompt failed' }));
    });

    it('reports a generic error when the reply prompt fails without a message', async () => {
        const mocks = buildMocks();
        mocks.templatedPrompts.reply = { success: false };

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Failed to generate adventure text');
    });

    it('removes the empty chat and reports the error when the reply stream cannot start', async () => {
        const mocks = buildMocks();
        mocks.completions.reply = () => ({ success: false, error: 'model unavailable' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.REMOVED, error: 'model unavailable' }));
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('reports a generic error when the reply stream fails without a message', async () => {
        const mocks = buildMocks();
        mocks.completions.reply = () => ({ success: false });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Failed to start model stream');
    });

    it('reports the error when the adventure cannot be hydrated for the reply prompt', async () => {
        const mocks = buildMocks();
        mocks.hydrate.execute
            .mockResolvedValueOnce({ success: true, hydrated: createHydrated() })
            .mockResolvedValueOnce({ success: false, error: 'storage failed' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.getTemplatedPrompt.execute).not.toHaveBeenCalled();
        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.REMOVED, error: 'storage failed' }));
    });

    it('keeps the continued content and reports the error when the reply cannot start', async () => {
        const chat = createChat({ content: ['Once upon'] });
        const mocks = buildMocks([], chat);
        mocks.completions.reply = () => ({ success: false, error: 'model unavailable' });
        mocks.hydrate.execute.mockResolvedValue({ success: true, hydrated: createHydrated([chat]) });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });
        await mocks.settled;

        expect(mocks.deleteChat.execute).not.toHaveBeenCalled();
        expect(mocks.finishStreaming.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.FINISHED, error: 'model unavailable' }));
    });

    it('removes the empty chat when the model returns nothing', async () => {
        const mocks = buildMocks([]);

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.deleteChat.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(mocks.updateStreaming.execute).not.toHaveBeenCalled();
        expect(mocks.finishStreaming.execute).not.toHaveBeenCalled();
        expect(mocks.events[mocks.events.length - 1]).toEqual({ adventureId: 'adventure-1', chatId: 'chat-1', status: ChatReplyStatusEnum.REMOVED, error: undefined });
    });

    it('removes only the empty streaming version when the chat has other versions', async () => {
        const chat = createChat({ content: ['kept answer', ''], index: 1 });
        const mocks = buildMocks([], chat);
        mocks.hydrate.execute.mockResolvedValue({ success: true, hydrated: createHydrated([chat]) });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });
        await mocks.settled;

        expect(mocks.deleteChatVersion.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1', versionIndex: 1 });
        expect(mocks.deleteChat.execute).not.toHaveBeenCalled();
    });

    it('finalizes what was generated and reports the error when the model stream breaks', async () => {
        const mocks = buildMocks();
        mocks.completions.reply = () => ({ success: true, stream: failingTokens(['partial'], new Error('Request failed with status 500')), abort: mocks.abortStream });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith(expect.objectContaining({ content: 'partial' }));
        expect(mocks.finishStreaming.execute).toHaveBeenCalled();
        expect(mocks.events[mocks.events.length - 1]).toEqual({
            adventureId: 'adventure-1',
            chatId: 'chat-1',
            status: ChatReplyStatusEnum.FINISHED,
            error: 'Request failed with status 500'
        });
    });

    it('reports a generic interruption when the model stream throws a non Error value', async () => {
        const mocks = buildMocks();
        mocks.completions.reply = () => ({ success: true, stream: failingTokens(['partial'], 'connection reset'), abort: mocks.abortStream });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Model stream interrupted');
    });

    it('reports an error when the reply cannot be finalized', async () => {
        const mocks = buildMocks();
        mocks.finishStreaming.execute.mockResolvedValue({ success: false, error: 'storage full' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.FINISHED, error: 'storage full' }));
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('falls back to a generic error when the reply cannot be finalized without a message', async () => {
        const mocks = buildMocks();
        mocks.finishStreaming.execute.mockResolvedValue({ success: false });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Failed to finalize assistant chat');
    });

    it('releases the adventure and reports a failure when a save throws unexpectedly', async () => {
        const mocks = buildMocks();
        mocks.finishStreaming.execute.mockRejectedValue(new Error('boom'));

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({
            status: ChatReplyStatusEnum.FINISHED,
            error: 'Failed to generate the assistant reply'
        }));
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('still finalizes the reply and reports the error when the final save fails', async () => {
        const mocks = buildMocks();
        mocks.updateStreaming.execute.mockResolvedValue({ success: false, error: 'storage full' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.finishStreaming.execute).toHaveBeenCalled();
        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.FINISHED, error: 'storage full' }));
    });

    it('reports a finished reply with the error when removing the empty chat fails', async () => {
        const mocks = buildMocks([]);
        mocks.deleteChat.execute.mockResolvedValue({ success: false, error: 'storage full' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.FINISHED, error: 'storage full' }));
    });

    it('reports a generic error when removing the empty chat fails without a message', async () => {
        const mocks = buildMocks([]);
        mocks.deleteChat.execute.mockResolvedValue({ success: false });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({
            status: ChatReplyStatusEnum.FINISHED,
            error: 'Failed to remove empty assistant chat'
        }));
    });

    it('does not publish an intermediate update that failed to save', async () => {
        const mocks = buildMocks(['a']);
        mocks.updateStreaming.execute
            .mockResolvedValueOnce({ success: false, error: 'busy' })
            .mockResolvedValueOnce({ success: true });

        await buildUseCase(mocks, 0).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events.map(event => event.status)).toEqual([ChatReplyStatusEnum.STREAMING, ChatReplyStatusEnum.FINISHED]);
    });

    it('attaches the parsed think with a generated session id', async () => {
        const mocks = buildMocks(['pondering the clue', '</think>', 'The clue leads north']);

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith({
            adventureId: 'adventure-1',
            chatId: 'chat-1',
            content: 'The clue leads north',
            think: { id: 'think-session', content: 'pondering the clue', enabled: true }
        });
    });

    it('continues an existing chat as its own speaker', async () => {
        const chat = createChat({ id: 'cleric-chat', role: RoleEnum.AI_PERSONA, characterId: 'cleric', content: ['Once upon'] });
        const mocks = buildMocks([' a time'], chat);
        mocks.hydrate.execute.mockResolvedValue({ success: true, hydrated: createHydrated([chat]) });
        mocks.turnSpeaker.resolveChatSpeaker.mockReturnValue({ success: true, speaker: clericSpeaker });
        mocks.turnSpeaker.resolveNextSpeaker.mockReturnValue({ success: true });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'cleric-chat' });
        await mocks.settled;

        expect(mocks.turnSpeaker.resolveChatSpeaker).toHaveBeenCalledWith(expect.anything(), chat);
        expect(mocks.startStreaming.execute).toHaveBeenCalledWith(expect.objectContaining({ chatId: 'cleric-chat', role: RoleEnum.AI_PERSONA }));
        expect(mocks.getTemplatedPrompt.execute).toHaveBeenNthCalledWith(2, expect.objectContaining({ targetChatId: 'cleric-chat' }));
        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith(expect.objectContaining({ content: 'Once upon a time' }));
    });

    it('gives the turn to the next speaker after continuing an AI character chat', async () => {
        const chat = createChat({ id: 'cleric-chat', role: RoleEnum.AI_PERSONA, characterId: 'cleric', content: ['Once upon'] });
        const masterChat = createChat({ id: 'master-chat' });
        const mocks = buildMocks([' a time'], chat);
        mocks.hydrate.execute.mockResolvedValue({ success: true, hydrated: createHydrated([chat]) });
        mocks.turnSpeaker.resolveChatSpeaker.mockReturnValue({ success: true, speaker: clericSpeaker });
        mocks.startStreaming.execute
            .mockResolvedValueOnce({ success: true, chat })
            .mockResolvedValueOnce({ success: true, chat: masterChat });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'cleric-chat' });
        await mocks.settled;

        expect(mocks.startStreaming.execute).toHaveBeenNthCalledWith(2, expect.objectContaining({ role: RoleEnum.ASSISTANT, chatId: undefined }));
    });

    it('fails without starting a chat when the chat to continue is not in the adventure', async () => {
        const mocks = buildMocks();

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'missing' });

        expect(response).toEqual({ success: false, error: 'Chat with id missing was not found' });
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
    });

    it('fails without starting a chat when the chat to continue was written by a player', async () => {
        const chat = createChat({ id: 'player-chat', role: RoleEnum.USER });
        const mocks = buildMocks();
        mocks.hydrate.execute.mockResolvedValue({ success: true, hydrated: createHydrated([chat]) });
        mocks.turnSpeaker.resolveChatSpeaker.mockReturnValue({ success: false, error: 'Chat with id player-chat cannot be generated from role user' });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'player-chat' });

        expect(response).toEqual({ success: false, error: 'Chat with id player-chat cannot be generated from role user' });
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
    });

    it('reuses the empty think slot of a continued chat', async () => {
        const chat = createChat({
            content: ['Once upon'],
            think: [{ id: 'think-existing', content: undefined, enabled: false }]
        });
        const mocks = buildMocks([' a time', 'reasoning', '</think>'], chat);
        mocks.hydrate.execute.mockResolvedValue({ success: true, hydrated: createHydrated([chat]) });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });
        await mocks.settled;

        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith(expect.objectContaining({
            think: { id: 'think-existing', content: 'Once upon a timereasoning', enabled: true }
        }));
    });

    it('keeps a preserved think untouched when the stream emits another thought tag', async () => {
        const chat = createChat({ think: [{ id: 'think-existing', content: 'preserved reasoning', enabled: true }] });
        const mocks = buildMocks(['fresh reasoning', '</think>', 'New content'], chat);
        mocks.hydrate.execute.mockResolvedValue({ success: true, hydrated: createHydrated([chat]) });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });
        await mocks.settled;

        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith({
            adventureId: 'adventure-1',
            chatId: 'chat-1',
            content: 'New content'
        });
    });

    it('continues from an empty base when the selected content version does not exist', async () => {
        const chat = createChat({ content: [], index: 0 });
        const mocks = buildMocks(['Hello'], chat);
        mocks.hydrate.execute.mockResolvedValue({ success: true, hydrated: createHydrated([chat]) });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });
        await mocks.settled;

        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith(expect.objectContaining({ content: 'Hello' }));
    });

    it('stops reading tokens when the registry stops the reply and still finalizes what was generated', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks();
        mocks.completions.reply = () => ({ success: true, stream: tokens.stream, abort: mocks.abortStream });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        tokens.push('first');
        await waitForBackgroundWork();
        mocks.registry.stop('adventure-1');
        tokens.push(' second');
        await mocks.settled;

        expect(mocks.abortStream).toHaveBeenCalled();
        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith(expect.objectContaining({ content: 'first' }));
        expect(mocks.finishStreaming.execute).toHaveBeenCalled();
        expect(mocks.events[mocks.events.length - 1].status).toBe(ChatReplyStatusEnum.FINISHED);
    });

    it('removes the chat without asking for the reply when stopped while the context is generated', async () => {
        const contextTokens = controllableTokens();
        const mocks = buildMocks();
        mocks.completions.context = () => ({ success: true, stream: contextTokens.stream, abort: mocks.abortContext });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await waitForBackgroundWork();
        mocks.registry.stop('adventure-1');
        contextTokens.push('late token');
        await mocks.settled;

        expect(mocks.abortContext).toHaveBeenCalled();
        expect(mocks.getTemplatedPrompt.execute).toHaveBeenCalledTimes(1);
        expect(mocks.deleteChat.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.REMOVED, error: undefined }));
    });

    it('removes the chat when stopped before any reply token arrives', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks();
        mocks.completions.reply = () => ({ success: true, stream: tokens.stream, abort: mocks.abortStream });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await waitForBackgroundWork();
        mocks.registry.stop('adventure-1');
        tokens.push('late token');
        await mocks.settled;

        expect(mocks.deleteChat.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(mocks.finishStreaming.execute).not.toHaveBeenCalled();
        expect(mocks.events[mocks.events.length - 1].status).toBe(ChatReplyStatusEnum.REMOVED);
    });

    it('throttles intermediate saves by default', async () => {
        const mocks = buildMocks();
        const useCase = new GenerateChatReplyUseCase(
            mockLogger,
            mocks.idGenerator,
            mocks.hydrate,
            mocks.turnSpeaker,
            mocks.getTemplatedPrompt,
            mocks.nativeStream,
            mocks.startStreaming,
            mocks.updateStreaming,
            mocks.finishStreaming,
            mocks.deleteChat,
            mocks.deleteChatVersion,
            mocks.channel,
            mocks.registry
        );

        await useCase.execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.updateStreaming.execute).toHaveBeenCalledTimes(1);
    });
});
