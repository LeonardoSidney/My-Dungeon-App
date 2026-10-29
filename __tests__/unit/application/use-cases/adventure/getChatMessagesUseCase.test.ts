import { GetChatMessagesUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('GetChatMessagesUseCase', () => {
    it('reads only the adventure and returns its chat', async () => {
        const chat = [createChatHelper({ id: 'chat-1' })];
        const repository = { getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure: createAdventureHelper({ chat }) }) };

        const response = await new GetChatMessagesUseCase(logger, repository as never).execute({ adventureId: 'adventure-1' });

        expect(repository.getAdventureById).toHaveBeenCalledWith('adventure-1');
        expect(response).toEqual({ success: true, chats: chat });
    });

    it('fails when the adventure does not exist', async () => {
        const repository = { getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure: undefined }) };

        const response = await new GetChatMessagesUseCase(logger, repository as never).execute({ adventureId: 'missing' });

        expect(response).toEqual({ success: false, error: 'Adventure with id missing not found' });
    });

    it('propagates a repository failure as an error result', async () => {
        const repository = { getAdventureById: jest.fn().mockResolvedValue({ success: false, error: 'storage offline' }) };

        const response = await new GetChatMessagesUseCase(logger, repository as never).execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });

    it('fails without reading the adventure when the id is blank', async () => {
        const repository = { getAdventureById: jest.fn() };

        const response = await new GetChatMessagesUseCase(logger, repository as never).execute({ adventureId: ' ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(repository.getAdventureById).not.toHaveBeenCalled();
    });
});
