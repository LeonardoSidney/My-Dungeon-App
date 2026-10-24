import { RegenerateFromChatController } from '@adapters/controllers';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('RegenerateFromChatController', () => {
    it('forwards the request and returns the chat the reply will be streamed into', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, replyChatId: 'reply-1' });

        const response = await new RegenerateFromChatController(logger, { execute }).handle({ adventureId: 'adventure-1', chatId: 'chat-1' });

        expect(execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(response).toEqual({ success: true, replyChatId: 'reply-1', error: undefined });
    });

    it('forwards the use case error', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Chat with id chat-1 was not found' });

        const response = await new RegenerateFromChatController(logger, { execute }).handle({ adventureId: 'adventure-1', chatId: 'chat-1' });

        expect(response).toEqual({ success: false, replyChatId: undefined, error: 'Chat with id chat-1 was not found' });
    });
});
