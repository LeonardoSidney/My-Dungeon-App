import { GenerateChatReplyUseCase } from '@application/use-cases';
import { Chat, RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ChatReplyEvent, ChatReplyStatusEnum } from '@domain/providers';
import { StreamSessionRegistry } from '@application/streaming';
import { createAdventureHelper, createHydratedAdventureHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const NO_INTERMEDIATE_UPDATES = 60_000;

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

function failingTokens (tokens: string[], error: Error) {
    return (async function* () {
        for (const token of tokens) {
            yield token;
        }
        throw error;
    })();
}

function buildMocks (tokens: string[] = ['Hello', ' world'], chat: Chat = createChat()) {
    const startedAdventure = createAdventureHelper({ chat: [chat] });
    const updatedAdventure = createAdventureHelper({ chat: [chat] });
    const finishedAdventure = createAdventureHelper({ chat: [{ ...chat, isStreaming: false }] });
    const removedAdventure = createAdventureHelper({ chat: [] });
    const abortStream = jest.fn();

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

    return {
        startedAdventure,
        updatedAdventure,
        finishedAdventure,
        removedAdventure,
        abortStream,
        events,
        settled,
        channel,
        registry: new StreamSessionRegistry(),
        hydrate: { execute: jest.fn().mockResolvedValue({ success: true, hydrated: createHydratedAdventureHelper() }) },
        getTemplatedPrompt: { execute: jest.fn().mockResolvedValue({ success: true, prompt: 'prompt' }) },
        nativeStream: {
            execute: jest.fn().mockResolvedValue({ success: true, stream: asyncTokens(tokens), abort: abortStream })
        },
        startStreaming: { execute: jest.fn().mockResolvedValue({ success: true, chat, adventure: startedAdventure }) },
        updateStreaming: { execute: jest.fn().mockResolvedValue({ success: true, chat, adventure: updatedAdventure }) },
        finishStreaming: { execute: jest.fn().mockResolvedValue({ success: true, chat, adventure: finishedAdventure }) },
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

    it('returns the assistant chat id right away and persists the reply in the background', async () => {
        const mocks = buildMocks();

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(response).toEqual({ success: true, chatId: 'chat-1' });
        expect(mocks.hydrate.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1' });
        expect(mocks.nativeStream.execute).toHaveBeenCalledWith({
            adventureId: 'adventure-1',
            connectionId: '1',
            samplerId: '1',
            modelId: '1',
            prompt: 'prompt'
        });
        expect(mocks.startStreaming.execute).toHaveBeenCalledWith({
            adventureId: 'adventure-1',
            role: RoleEnum.ASSISTANT,
            characterId: '1',
            chatId: undefined
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

    it('keeps the adventure marked as replying until the reply settles', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks();
        mocks.nativeStream.execute.mockResolvedValue({ success: true, stream: tokens.stream, abort: mocks.abortStream });
        const useCase = buildUseCase(mocks);

        await useCase.execute({ adventureId: 'adventure-1' });
        expect(mocks.registry.isActive('adventure-1')).toBe(true);

        tokens.push('Hi');
        tokens.end();
        await mocks.settled;

        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('rejects a second reply while one is still being generated for the adventure', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks();
        mocks.nativeStream.execute.mockResolvedValue({ success: true, stream: tokens.stream, abort: mocks.abortStream });
        const useCase = buildUseCase(mocks);

        await useCase.execute({ adventureId: 'adventure-1' });
        const second = await useCase.execute({ adventureId: 'adventure-1' });

        expect(second).toEqual({ success: false, error: 'A reply is already being generated for this adventure' });
        expect(mocks.hydrate.execute).toHaveBeenCalledTimes(1);

        tokens.end();
        await mocks.settled;
    });

    it('fails validation without an adventure id', async () => {
        const mocks = buildMocks();

        const response = await buildUseCase(mocks).execute({ adventureId: ' ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(mocks.hydrate.execute).not.toHaveBeenCalled();
    });

    it('succeeds without a chat when the adventure has no world master runtime', async () => {
        const mocks = buildMocks();
        mocks.hydrate.execute.mockResolvedValue({
            success: true,
            hydrated: createHydratedAdventureHelper({ withoutWorldMaster: true })
        });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true });
        expect(mocks.getTemplatedPrompt.execute).not.toHaveBeenCalled();
        expect(mocks.nativeStream.execute).not.toHaveBeenCalled();
        expect(mocks.channel.publish).not.toHaveBeenCalled();
    });

    it('fails without starting the chat when the prompt cannot be built', async () => {
        const mocks = buildMocks();
        mocks.getTemplatedPrompt.execute.mockResolvedValue({ success: false, error: 'prompt failed' });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'prompt failed' });
        expect(mocks.nativeStream.execute).not.toHaveBeenCalled();
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
    });

    it('fails without starting the chat when the model stream cannot start', async () => {
        const mocks = buildMocks();
        mocks.nativeStream.execute.mockResolvedValue({ success: false, error: 'model unavailable' });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'model unavailable' });
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
    });

    it('aborts the model stream and releases the adventure when the assistant chat cannot be started', async () => {
        const mocks = buildMocks();
        mocks.startStreaming.execute.mockResolvedValue({ success: false, error: 'storage failed' });

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'storage failed' });
        expect(mocks.abortStream).toHaveBeenCalled();
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
        expect(mocks.channel.publish).not.toHaveBeenCalled();
    });

    it('removes the empty assistant chat when the model returns nothing', async () => {
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

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });
        await mocks.settled;

        expect(mocks.deleteChatVersion.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1', versionIndex: 1 });
        expect(mocks.deleteChat.execute).not.toHaveBeenCalled();
    });

    it('finalizes what was generated and reports the error when the model stream breaks', async () => {
        const mocks = buildMocks();
        mocks.nativeStream.execute.mockResolvedValue({
            success: true,
            stream: failingTokens(['partial'], new Error('Request failed with status 500')),
            abort: mocks.abortStream
        });

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

    it('reports an error when the reply cannot be finalized', async () => {
        const mocks = buildMocks();
        mocks.finishStreaming.execute.mockResolvedValue({ success: false, error: 'storage full' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.FINISHED, error: 'storage full' }));
        expect(mocks.registry.isActive('adventure-1')).toBe(false);
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

    it('continues an existing chat from its current content and reuses its empty think slot', async () => {
        const chat = createChat({
            content: ['Once upon'],
            think: [{ id: 'think-existing', content: undefined, enabled: false }]
        });
        const mocks = buildMocks([' a time', 'reasoning', '</think>'], chat);

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });
        await mocks.settled;

        expect(mocks.startStreaming.execute).toHaveBeenCalledWith(expect.objectContaining({ chatId: 'chat-1' }));
        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith(expect.objectContaining({
            think: { id: 'think-existing', content: 'Once upon a timereasoning', enabled: true }
        }));
    });

    it('keeps a preserved think untouched when the stream emits another thought tag', async () => {
        const chat = createChat({ think: [{ id: 'think-existing', content: 'preserved reasoning', enabled: true }] });
        const mocks = buildMocks(['fresh reasoning', '</think>', 'New content'], chat);

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });
        await mocks.settled;

        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith({
            adventureId: 'adventure-1',
            chatId: 'chat-1',
            content: 'New content'
        });
    });

    it('stops reading tokens when the registry stops the reply and still finalizes what was generated', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks();
        mocks.nativeStream.execute.mockResolvedValue({ success: true, stream: tokens.stream, abort: mocks.abortStream });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        tokens.push('first');
        await new Promise<void>(resolve => setImmediate(() => resolve()));
        mocks.registry.stop('adventure-1');
        tokens.push(' second');
        await mocks.settled;

        expect(mocks.abortStream).toHaveBeenCalled();
        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith(expect.objectContaining({ content: 'first' }));
        expect(mocks.finishStreaming.execute).toHaveBeenCalled();
        expect(mocks.events[mocks.events.length - 1].status).toBe(ChatReplyStatusEnum.FINISHED);
    });

    it('removes the assistant chat when stopped before any token arrives', async () => {
        const tokens = controllableTokens();
        const mocks = buildMocks();
        mocks.nativeStream.execute.mockResolvedValue({ success: true, stream: tokens.stream, abort: mocks.abortStream });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
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

    it.each([
        [{ success: false, error: 'adventure missing' }, 'adventure missing'],
        [{ success: false }, 'Failed to hydrate adventure'],
        [{ success: true }, 'Failed to hydrate adventure']
    ])('fails without generating when hydration answers %j', async (hydrateResponse, error) => {
        const mocks = buildMocks();
        mocks.hydrate.execute.mockResolvedValue(hydrateResponse);

        const response = await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error });
        expect(mocks.getTemplatedPrompt.execute).not.toHaveBeenCalled();
    });

    it('falls back to generic errors when the setup steps fail without a message', async () => {
        const mocks = buildMocks();

        mocks.getTemplatedPrompt.execute.mockResolvedValueOnce({ success: false });
        expect(await buildUseCase(mocks).execute({ adventureId: 'adventure-1' }))
            .toEqual({ success: false, error: 'Failed to generate adventure text' });

        mocks.nativeStream.execute.mockResolvedValueOnce({ success: false });
        expect(await buildUseCase(mocks).execute({ adventureId: 'adventure-1' }))
            .toEqual({ success: false, error: 'Failed to start model stream' });

        mocks.startStreaming.execute.mockResolvedValueOnce({ success: false });
        expect(await buildUseCase(mocks).execute({ adventureId: 'adventure-1' }))
            .toEqual({ success: false, error: 'Failed to start assistant chat' });
    });

    it('aborts the model stream when another reply claims the adventure first', async () => {
        const mocks = buildMocks();
        const registry = { isActive: jest.fn().mockReturnValue(false), start: jest.fn().mockReturnValue(false), release: jest.fn(), stop: jest.fn() };
        const useCase = new GenerateChatReplyUseCase(
            mockLogger,
            mocks.idGenerator,
            mocks.hydrate,
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
        expect(mocks.abortStream).toHaveBeenCalled();
        expect(mocks.startStreaming.execute).not.toHaveBeenCalled();
    });

    it('continues from an empty base when the selected content version does not exist', async () => {
        const chat = createChat({ content: [], index: 0 });
        const mocks = buildMocks(['Hello'], chat);

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });
        await mocks.settled;

        expect(mocks.updateStreaming.execute).toHaveBeenLastCalledWith(expect.objectContaining({ content: 'Hello' }));
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

    it('reports a generic interruption when the model stream throws a non Error value', async () => {
        const mocks = buildMocks();
        mocks.nativeStream.execute.mockResolvedValue({
            success: true,
            stream: (async function* () {
                yield 'partial';
                throw 'connection reset';
            })(),
            abort: mocks.abortStream
        });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Model stream interrupted');
    });

    it.each([
        [{ success: false, error: 'storage full' }, 'storage full'],
        [{ success: false }, 'Failed to remove empty assistant chat']
    ])('reports a finished reply with an error when removing the empty chat answers %j', async (removeResponse, error) => {
        const mocks = buildMocks([]);
        mocks.deleteChat.execute.mockResolvedValue(removeResponse);

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.FINISHED, error }));
    });

    it('still finalizes the reply and reports the error when the final save fails', async () => {
        const mocks = buildMocks();
        mocks.updateStreaming.execute.mockResolvedValue({ success: false, error: 'storage full' });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.finishStreaming.execute).toHaveBeenCalled();
        expect(mocks.events[mocks.events.length - 1]).toEqual(expect.objectContaining({ status: ChatReplyStatusEnum.FINISHED, error: 'storage full' }));
    });

    it('falls back to a generic error when the reply cannot be finalized without a message', async () => {
        const mocks = buildMocks();
        mocks.finishStreaming.execute.mockResolvedValue({ success: false });

        await buildUseCase(mocks).execute({ adventureId: 'adventure-1' });
        await mocks.settled;

        expect(mocks.events[mocks.events.length - 1].error).toBe('Failed to finalize assistant chat');
    });
});
