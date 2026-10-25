import { GetChatByIdUseCase, StopChatReplyUseCase, SubscribeChatReplyUseCase } from '@application/use-cases';
import { KeyedEventBus, StreamSessionRegistry } from '@application/streaming';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper, createBackgroundExecutionHelper } from '@test/helpers';
import { ChatReplyEvent, ChatReplyStatusEnum } from '@domain/providers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('GetChatByIdUseCase', () => {
    it('returns the chat with the given id from the adventure', async () => {
        const chat = createChatHelper({ id: 'chat-2' });
        const repository = {
            getAdventureById: jest.fn().mockResolvedValue({
                success: true,
                adventure: createAdventureHelper({ chat: [createChatHelper({ id: 'chat-1' }), chat] })
            })
        };

        const response = await new GetChatByIdUseCase(logger, repository as never).execute({ adventureId: 'adventure-1', chatId: 'chat-2' });

        expect(repository.getAdventureById).toHaveBeenCalledWith('adventure-1');
        expect(response).toEqual({ success: true, chat });
    });

    it('fails when the chat is not in the adventure', async () => {
        const repository = { getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure: createAdventureHelper({ chat: [] }) }) };

        const response = await new GetChatByIdUseCase(logger, repository as never).execute({ adventureId: 'adventure-1', chatId: 'missing' });

        expect(response).toEqual({ success: false, error: 'Chat with id missing not found' });
    });

    it('fails when the adventure does not exist', async () => {
        const repository = { getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure: undefined }) };

        const response = await new GetChatByIdUseCase(logger, repository as never).execute({ adventureId: 'missing', chatId: 'chat-1' });

        expect(response).toEqual({ success: false, error: 'Adventure with id missing not found' });
    });

    it('propagates a repository failure as an error result', async () => {
        const repository = { getAdventureById: jest.fn().mockResolvedValue({ success: false, error: 'storage offline' }) };

        const response = await new GetChatByIdUseCase(logger, repository as never).execute({ adventureId: 'adventure-1', chatId: 'chat-1' });

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });

    it.each([
        [{ adventureId: ' ', chatId: 'chat-1' }, 'Adventure id is required'],
        [{ adventureId: 'adventure-1', chatId: '' }, 'Chat id is required'],
    ])('validates %p before reading the storage', async (params, error) => {
        const repository = { getAdventureById: jest.fn() };

        const response = await new GetChatByIdUseCase(logger, repository as never).execute(params);

        expect(response).toEqual({ success: false, error });
        expect(repository.getAdventureById).not.toHaveBeenCalled();
    });
});

describe('StopChatReplyUseCase', () => {
    it('aborts the active reply of the adventure', () => {
        const registry = new StreamSessionRegistry(createBackgroundExecutionHelper());
        const abort = jest.fn();
        registry.start('adventure-1', abort);

        const response = new StopChatReplyUseCase(logger, registry).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true });
        expect(abort).toHaveBeenCalled();
    });

    it('succeeds when there is nothing to stop', () => {
        const response = new StopChatReplyUseCase(logger, new StreamSessionRegistry(createBackgroundExecutionHelper())).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true });
    });

    it('requires an adventure id', () => {
        const response = new StopChatReplyUseCase(logger, new StreamSessionRegistry(createBackgroundExecutionHelper())).execute({ adventureId: '' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
    });
});

describe('SubscribeChatReplyUseCase', () => {
    it('subscribes the listener to the adventure and tells whether a reply is running', () => {
        const bus = new KeyedEventBus<ChatReplyEvent>(logger, event => event.adventureId);
        const registry = new StreamSessionRegistry(createBackgroundExecutionHelper());
        registry.start('adventure-1', jest.fn());
        const listener = jest.fn();

        const response = new SubscribeChatReplyUseCase(logger, bus, registry).execute({ adventureId: 'adventure-1', listener });
        bus.publish({ adventureId: 'adventure-1', chatId: 'chat-1', status: ChatReplyStatusEnum.STREAMING });

        expect(response.success).toBe(true);
        expect(response.isReplying).toBe(true);
        expect(listener).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1', status: ChatReplyStatusEnum.STREAMING });
    });

    it('returns an unsubscribe that stops the notifications', () => {
        const bus = new KeyedEventBus<ChatReplyEvent>(logger, event => event.adventureId);
        const listener = jest.fn();

        const response = new SubscribeChatReplyUseCase(logger, bus, new StreamSessionRegistry(createBackgroundExecutionHelper())).execute({ adventureId: 'adventure-1', listener });
        response.unsubscribe!();
        bus.publish({ adventureId: 'adventure-1', chatId: 'chat-1', status: ChatReplyStatusEnum.FINISHED });

        expect(response.isReplying).toBe(false);
        expect(listener).not.toHaveBeenCalled();
    });

    it('requires an adventure id', () => {
        const bus = new KeyedEventBus<ChatReplyEvent>(logger, event => event.adventureId);
        const subscribe = jest.spyOn(bus, 'subscribe');

        const response = new SubscribeChatReplyUseCase(logger, bus, new StreamSessionRegistry(createBackgroundExecutionHelper())).execute({ adventureId: '', listener: jest.fn() });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(subscribe).not.toHaveBeenCalled();
    });
});
