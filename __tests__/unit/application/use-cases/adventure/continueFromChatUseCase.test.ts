import { ContinueFromChatUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IContinueFromChatService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockContinueFromChatService = {
    continueFromChat: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn(),
    updateAdventure: jest.fn()
};

function buildUseCase (): ContinueFromChatUseCase {
    return new ContinueFromChatUseCase(
        mockLogger,
        mockContinueFromChatService as unknown as IContinueFromChatService,
        mockAdventureRepository as unknown as IAdventureRepository
    );
}

function buildParams (overrides: Record<string, unknown> = {}) {
    const providedAdventure = overrides.adventure as ReturnType<typeof createAdventureHelper> | undefined;
    const adventure = providedAdventure ?? createAdventureHelper({ chat: [createChatHelper()] });
    mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure });
    return {
        adventure,
        adventureId: adventure.id,
        chatId: 'chat-1',
        ...overrides
    };
}

describe('ContinueFromChatUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the updated adventure and returns it', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const updatedAdventure = { ...adventure, chat: [] };

        mockContinueFromChatService.continueFromChat.mockReturnValue({ success: true, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: true, adventure: updatedAdventure });
        expect(mockContinueFromChatService.continueFromChat).toHaveBeenCalledWith(expect.objectContaining({ adventure, chatId: 'chat-1' }));
        expect(mockAdventureRepository.updateAdventure).toHaveBeenCalledWith({ adventure: updatedAdventure });
    });

    it('returns the service error without persisting when the chat was not found', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockContinueFromChatService.continueFromChat.mockReturnValue({
            success: false,
            error: 'Chat with id chat-1 was not found'
        });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 was not found' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns an error when the service succeeds without an adventure', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockContinueFromChatService.continueFromChat.mockReturnValue({ success: true });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Service returned success but no adventure object' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when persistence fails', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const updatedAdventure = { ...adventure, chat: [] };

        mockContinueFromChatService.continueFromChat.mockReturnValue({ success: true, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false, error: 'Failed to update adventure' });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Failed to update adventure' });
    });

    it('fails when the chat id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ chatId: '' }));

        expect(response).toEqual({ success: false, error: 'Chat id is required' });
        expect(mockContinueFromChatService.continueFromChat).not.toHaveBeenCalled();
    });

    it('fails when the adventure id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ adventureId: '' }));

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(mockAdventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventure cannot be loaded', async () => {
        const params = buildParams();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(mockContinueFromChatService.continueFromChat).not.toHaveBeenCalled();
    });

    it('fails when the adventure does not exist', async () => {
        const params = buildParams();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: `Adventure with id ${params.adventureId} not found` });
        expect(mockContinueFromChatService.continueFromChat).not.toHaveBeenCalled();
    });

    it('falls back to a generic error when persistence fails without a message', async () => {
        const params = buildParams();
        mockContinueFromChatService.continueFromChat.mockReturnValue({ success: true, adventure: params.adventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: 'Failed to save adventure' });
    });
});
