import { ResendChatUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IResendChatService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockResendChatService = {
    resendChat: jest.fn()
};

const mockAdventureRepository = {
    updateAdventure: jest.fn()
};

function buildUseCase (): ResendChatUseCase {
    return new ResendChatUseCase(
        mockLogger,
    mockResendChatService as unknown as IResendChatService,
    mockAdventureRepository as unknown as IAdventureRepository
    );
}

function buildParams (overrides: Record<string, unknown> = {}) {
    return {
        adventure: createAdventureHelper({ chat: [createChatHelper()] }),
        chatId: 'chat-1',
        ...overrides
    };
}

describe('ResendChatUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the updated adventure and returns it', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const updatedAdventure = { ...adventure, chat: [] };

        mockResendChatService.resendChat.mockReturnValue({ success: true, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: true, adventure: updatedAdventure });
        expect(mockResendChatService.resendChat).toHaveBeenCalledWith(expect.objectContaining({ adventure, chatId: 'chat-1' }));
        expect(mockAdventureRepository.updateAdventure).toHaveBeenCalledWith({ adventure: updatedAdventure });
    });

    it('returns the service error without persisting when the chat was not found', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockResendChatService.resendChat.mockReturnValue({
            success: false,
            error: 'Chat with id chat-1 was not found'
        });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 was not found' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns an error when the service succeeds without an adventure', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockResendChatService.resendChat.mockReturnValue({ success: true });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Service returned success but no adventure object' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when persistence fails', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const updatedAdventure = { ...adventure, chat: [] };

        mockResendChatService.resendChat.mockReturnValue({ success: true, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false, error: 'Failed to update adventure' });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Failed to update adventure' });
    });

    it('fails when the chat id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ chatId: '' }));

        expect(response).toEqual({ success: false, error: 'Chat id is required' });
        expect(mockResendChatService.resendChat).not.toHaveBeenCalled();
    });
});
