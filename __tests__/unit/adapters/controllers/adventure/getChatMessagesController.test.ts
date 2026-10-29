import { GetChatMessagesController } from '@adapters/controllers';
import { ChatMessagesPresenter } from '@adapters/presenters';
import { RoleEnum } from '@domain/entities';
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

describe('GetChatMessagesController', () => {
    it('presents every chat of the adventure as a message view', async () => {
        const chats = [
            createChatHelper({ id: 'chat-1', role: RoleEnum.USER, content: ['hello'] }),
            createChatHelper({ id: 'chat-2', role: RoleEnum.ASSISTANT, content: ['first', 'second'], index: 1 })
        ];
        const execute = jest.fn().mockResolvedValue({ success: true, chats });

        const response = await new GetChatMessagesController(logger, { execute }, new ChatMessagesPresenter()).handle({ adventureId: 'adventure-1' });

        expect(execute).toHaveBeenCalledWith({ adventureId: 'adventure-1' });
        expect(response.success).toBe(true);
        expect(response.messages?.map(message => [message.id, message.content])).toEqual([['chat-1', 'hello'], ['chat-2', 'second']]);
    });

    it('forwards the use case error without messages', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Adventure with id adventure-1 not found' });

        const response = await new GetChatMessagesController(logger, { execute }, new ChatMessagesPresenter()).handle({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, messages: undefined, error: 'Adventure with id adventure-1 not found' });
    });
});
