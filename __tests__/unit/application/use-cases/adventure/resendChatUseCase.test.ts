import { ResendChatUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IResendChatService } from '@domain/services';
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

const mockResendChatService = {
    resendChat: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn(),
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
    const adventure = (overrides.adventure as ReturnType<typeof createAdventureHelper> | undefined)
        ?? createAdventureHelper({ chat: [createChatHelper()] });
    mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure });
    return {
        adventure,
        adventureId: adventure.id,
        chatId: 'chat-1',
        ...overrides
    };
}

describe('ResendChatUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the updated adventure and only acknowledges the command', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const updatedAdventure = { ...adventure, chat: [] };

        mockResendChatService.resendChat.mockReturnValue({ success: true, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: true });
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

    it('resends the last chat when no chat id is given', async () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'chat-1' }), createChatHelper({ id: 'chat-2' })]
        });
        mockResendChatService.resendChat.mockReturnValue({ success: true, adventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure });

        await buildUseCase().execute(buildParams({ adventure, chatId: undefined }));

        expect(mockResendChatService.resendChat).toHaveBeenCalledWith(expect.objectContaining({ chatId: 'chat-2' }));
    });

    it('fails when the adventure has no chat history', async () => {
        const adventure = createAdventureHelper({ chat: [] });

        const response = await buildUseCase().execute(buildParams({ adventure, chatId: undefined }));

        expect(response).toEqual({ success: false, error: 'No chat history to resend' });
        expect(mockResendChatService.resendChat).not.toHaveBeenCalled();
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
        expect(mockResendChatService.resendChat).not.toHaveBeenCalled();
    });

    it('fails when the adventure does not exist', async () => {
        const params = buildParams();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: `Adventure with id ${params.adventureId} not found` });
        expect(mockResendChatService.resendChat).not.toHaveBeenCalled();
    });

    it('falls back to a generic error when persistence fails without a message', async () => {
        const params = buildParams();
        mockResendChatService.resendChat.mockReturnValue({ success: true, adventure: params.adventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: 'Failed to save adventure' });
    });
});
