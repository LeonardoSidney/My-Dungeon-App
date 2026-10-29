import { AppendChatAdventureController } from '@adapters/controllers';
import { IAppendChatAdventureUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';

const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
};

const mockUseCase = {
    execute: jest.fn(),
};

const REQUEST = { adventureId: 'adventure-1', characterId: 'character-1', content: 'Hello world' };

describe('AppendChatAdventureController', () => {
    let controller: AppendChatAdventureController;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new AppendChatAdventureController(
            mockLogger as unknown as ILogger,
            mockUseCase as unknown as IAppendChatAdventureUseCase
        );
    });

    it('forwards only the ids and the typed content to the use case', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true, id: 'chat-9' });

        await controller.handle(REQUEST);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing AppendChatAdventureController::handle');
        expect(mockUseCase.execute).toHaveBeenCalledWith(REQUEST);
    });

    it('responds with the id of the new message only', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true, id: 'chat-9' });

        const response = await controller.handle(REQUEST);

        expect(response).toEqual({ success: true, id: 'chat-9', error: undefined });
        expect(response).not.toHaveProperty('messages');
    });

    it('returns the use case error when it fails', async () => {
        mockUseCase.execute.mockResolvedValue({ success: false, error: 'Adventure with id adventure-1 not found' });

        const response = await controller.handle(REQUEST);

        expect(response).toEqual({ success: false, id: undefined, error: 'Adventure with id adventure-1 not found' });
    });
});
