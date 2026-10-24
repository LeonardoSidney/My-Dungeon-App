import { RegenerateFromChatUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IRegenerateFromChatService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockRegenerateFromChatService = {
    regenerateFromChat: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn(),
    updateAdventure: jest.fn()
};

function buildUseCase (): RegenerateFromChatUseCase {
    return new RegenerateFromChatUseCase(
        mockLogger,
        mockRegenerateFromChatService as unknown as IRegenerateFromChatService,
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

describe('RegenerateFromChatUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the updated adventure and answers without a reply chat when none is kept', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const updatedAdventure = { ...adventure, chat: [] };

        mockRegenerateFromChatService.regenerateFromChat.mockReturnValue({ success: true, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: true, replyChatId: undefined });
        expect(mockRegenerateFromChatService.regenerateFromChat).toHaveBeenCalledWith(expect.objectContaining({ adventure, chatId: 'chat-1' }));
        expect(mockAdventureRepository.updateAdventure).toHaveBeenCalledWith({ adventure: updatedAdventure });
    });

    it('returns the id of the chat the reply will be streamed into', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const kept = createChatHelper({ id: 'assistant-1' });
        const updatedAdventure = { ...adventure, chat: [kept] };
        mockRegenerateFromChatService.regenerateFromChat.mockReturnValue({ success: true, chat: kept, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: true, replyChatId: 'assistant-1' });
    });

    it('returns the service error without persisting when no user message exists', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockRegenerateFromChatService.regenerateFromChat.mockReturnValue({
            success: false,
            error: 'No user message found before chat chat-1'
        });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'No user message found before chat chat-1' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns an error when the service succeeds without an adventure', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockRegenerateFromChatService.regenerateFromChat.mockReturnValue({ success: true });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Service returned success but no adventure object' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when persistence fails', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const updatedAdventure = { ...adventure, chat: [] };

        mockRegenerateFromChatService.regenerateFromChat.mockReturnValue({ success: true, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false, error: 'Failed to update adventure' });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Failed to update adventure' });
    });

    it('fails when the chat id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ chatId: '' }));

        expect(response).toEqual({ success: false, error: 'Chat id is required' });
        expect(mockRegenerateFromChatService.regenerateFromChat).not.toHaveBeenCalled();
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
        expect(mockRegenerateFromChatService.regenerateFromChat).not.toHaveBeenCalled();
    });

    it('fails when the adventure does not exist', async () => {
        const params = buildParams();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: `Adventure with id ${params.adventureId} not found` });
        expect(mockRegenerateFromChatService.regenerateFromChat).not.toHaveBeenCalled();
    });

    it('falls back to a generic error when persistence fails without a message', async () => {
        const params = buildParams();
        mockRegenerateFromChatService.regenerateFromChat.mockReturnValue({ success: true, adventure: params.adventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: 'Failed to save adventure' });
    });
});
