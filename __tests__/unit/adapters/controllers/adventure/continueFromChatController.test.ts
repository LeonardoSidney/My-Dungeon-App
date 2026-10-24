import { ContinueFromChatController } from '@adapters/controllers';
import { ILogger } from '@domain/logger';
import { createAdventureHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('ContinueFromChatController', () => {
    it('only acknowledges the command, without returning the chat', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, adventure: createAdventureHelper() });

        const response = await new ContinueFromChatController(logger, { execute }).handle({ adventureId: 'adventure-1', chatId: 'chat-1' });

        expect(execute).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(response).toEqual({ success: true, error: undefined });
        expect(Object.keys(response).sort()).toEqual(['error', 'success']);
    });

    it('forwards the use case error', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Chat with id chat-1 was not found' });

        const response = await new ContinueFromChatController(logger, { execute }).handle({ adventureId: 'adventure-1', chatId: 'chat-1' });

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 was not found' });
    });
});
