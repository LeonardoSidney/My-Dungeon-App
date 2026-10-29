import { GenerateChatReplyController, GetChatMessageController, RecoverInterruptedRepliesController, StopChatReplyController, SubscribeChatReplyController } from '@adapters/controllers';
import { ChatMessagesPresenter } from '@adapters/presenters';
import { RoleEnum } from '@domain/entities';
import { ChatReplyListener, ChatReplyStatusEnum } from '@domain/providers';
import { ILogger } from '@domain/logger';
import { createChatHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('GenerateChatReplyController', () => {
    it('forwards the request and returns the started chat id', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, chatId: 'chat-1' });

        const response = await new GenerateChatReplyController(logger, { execute }).handle({ adventureId: 'adventure-1', chatId: 'chat-1' });

        expect(execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(response).toEqual({ success: true, chatId: 'chat-1', error: undefined });
    });
});

describe('GetChatMessageController', () => {
    it('presents the chat as a message view', async () => {
        const chat = createChatHelper({ id: 'chat-1', role: RoleEnum.ASSISTANT, content: ['first', 'second'], index: 1, isStreaming: true });
        const execute = jest.fn().mockResolvedValue({ success: true, chat });

        const response = await new GetChatMessageController(logger, { execute }, new ChatMessagesPresenter()).handle({ adventureId: 'adventure-1', chatId: 'chat-1' });

        expect(execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(response).toEqual({
            success: true,
            message: {
                id: 'chat-1',
                role: RoleEnum.ASSISTANT,
                characterId: 'character-1',
                content: 'second',
                contentIndex: 1,
                contentCount: 2,
                think: undefined,
                isStreaming: true
            },
            error: undefined
        });
    });

    it('forwards the not found error', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Chat with id chat-1 not found' });

        const response = await new GetChatMessageController(logger, { execute }, new ChatMessagesPresenter()).handle({ adventureId: 'adventure-1', chatId: 'chat-1' });

        expect(response).toEqual({ success: false, message: undefined, error: 'Chat with id chat-1 not found' });
    });
});

describe('StopChatReplyController', () => {
    it('forwards the stop request', () => {
        const execute = jest.fn().mockReturnValue({ success: true });

        const response = new StopChatReplyController(logger, { execute }).handle({ adventureId: 'adventure-1' });

        expect(execute).toHaveBeenCalledWith({ adventureId: 'adventure-1' });
        expect(response).toEqual({ success: true });
    });
});

describe('SubscribeChatReplyController', () => {
    function subscribe () {
        let listener: ChatReplyListener = () => undefined;
        const unsubscribe = jest.fn();
        const execute = jest.fn((params: { listener: ChatReplyListener; }) => {
            listener = params.listener;
            return { success: true, isReplying: true, unsubscribe };
        });
        const onUpdate = jest.fn();

        const response = new SubscribeChatReplyController(logger, { execute }).handle({ adventureId: 'adventure-1', onUpdate });

        return { response, onUpdate, unsubscribe, emit: listener };
    }

    it('returns the subscription state from the use case', () => {
        const { response, unsubscribe } = subscribe();

        expect(response).toEqual({ success: true, isReplying: true, unsubscribe, error: undefined });
    });

    it.each([
        [ChatReplyStatusEnum.STREAMING, { isFinished: false, isRemoved: false }],
        [ChatReplyStatusEnum.FINISHED, { isFinished: true, isRemoved: false }],
        [ChatReplyStatusEnum.REMOVED, { isFinished: true, isRemoved: true }],
    ] as const)('maps a %s event into an update view', (status, flags) => {
        const { onUpdate, emit } = subscribe();

        emit({ adventureId: 'adventure-1', chatId: 'chat-1', status, error: 'oops' });

        expect(onUpdate).toHaveBeenCalledWith({ chatId: 'chat-1', ...flags, error: 'oops' });
    });
});

describe('RecoverInterruptedRepliesController', () => {
    it('returns only the outcome of the recovery', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, recoveredChatIds: ['reply'], error: 'storage full' });

        const response = await new RecoverInterruptedRepliesController(logger, { execute }).handle();

        expect(response).toEqual({ success: false, error: 'storage full' });
    });
});
