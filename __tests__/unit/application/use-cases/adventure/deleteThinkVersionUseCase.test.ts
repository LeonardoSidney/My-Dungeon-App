import { DeleteThinkVersionUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IDeleteThinkVersionService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockDeleteThinkVersionService = {
    deleteThink: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn(),
    updateAdventure: jest.fn()
};

function buildUseCase (): DeleteThinkVersionUseCase {
    return new DeleteThinkVersionUseCase(
        mockLogger,
        mockDeleteThinkVersionService as unknown as IDeleteThinkVersionService,
        mockAdventureRepository as unknown as IAdventureRepository
    );
}

function buildParams (overrides: Record<string, unknown> = {}) {
    const adventure = (overrides.adventure as ReturnType<typeof createAdventureHelper> | undefined)
        ?? createAdventureHelper({
            chat: [createChatHelper({
                think: [
                    { id: 't0', content: 'zero', enabled: true },
                    { id: 't1', content: 'one', enabled: true }
                ],
                thinkIndex: 1
            })]
        });
    mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure });

    return {
        adventure,
        adventureId: adventure.id,
        chatId: 'chat-1',
        versionIndex: 1,
        ...overrides
    };
}

describe('DeleteThinkVersionUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the deleted version and only acknowledges the command', async () => {
        const { adventure } = buildParams();
        const chat = createChatHelper({
            think: [{ id: 't0', content: 'zero', enabled: true }],
            thinkIndex: 0
        });
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockDeleteThinkVersionService.deleteThink.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams());

        expect(response).toEqual({ success: true });
        expect(mockDeleteThinkVersionService.deleteThink).toHaveBeenCalledWith({ adventure, chatId: 'chat-1', versionIndex: 1 });
        expect(mockAdventureRepository.updateAdventure).toHaveBeenCalledWith({ adventure: updatedAdventure });
    });

    it('refuses to delete the only think version without touching the service', async () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({
                think: [{ id: 't0', content: 'only', enabled: true }],
                thinkIndex: 0
            })]
        });

        const response = await buildUseCase().execute(buildParams({ adventure, index: 0 }));

        expect(response).toEqual({ success: false, error: 'The only think version of a chat cannot be deleted' });
        expect(mockDeleteThinkVersionService.deleteThink).not.toHaveBeenCalled();
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the service error without persisting when the chat has no thinks', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockDeleteThinkVersionService.deleteThink.mockReturnValue({
            success: false,
            error: 'Chat with id chat-1 has no think versions to delete'
        });

        const response = await buildUseCase().execute(buildParams({ adventure, index: 0 }));

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 has no think versions to delete' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns an error when the service succeeds without an adventure', async () => {
        const chat = createChatHelper();

        mockDeleteThinkVersionService.deleteThink.mockReturnValue({ success: true, chat });

        const response = await buildUseCase().execute(buildParams());

        expect(response).toEqual({ success: false, error: 'Service returned success but no adventure object' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when persistence fails', async () => {
        const { adventure } = buildParams();
        const chat = createChatHelper();
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockDeleteThinkVersionService.deleteThink.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false, error: 'Failed to update adventure' });

        const response = await buildUseCase().execute(buildParams());

        expect(response).toEqual({ success: false, error: 'Failed to update adventure' });
    });

    it('fails when the chat id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ chatId: '' }));

        expect(response).toEqual({ success: false, error: 'Chat id is required' });
        expect(mockDeleteThinkVersionService.deleteThink).not.toHaveBeenCalled();
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
        expect(mockDeleteThinkVersionService.deleteThink).not.toHaveBeenCalled();
    });

    it('fails when the adventure does not exist', async () => {
        const params = buildParams();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: `Adventure with id ${params.adventureId} not found` });
        expect(mockDeleteThinkVersionService.deleteThink).not.toHaveBeenCalled();
    });

    it('falls back to a generic error when persistence fails without a message', async () => {
        const params = buildParams();
        mockDeleteThinkVersionService.deleteThink.mockReturnValue({ success: true, adventure: params.adventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: 'Failed to save adventure' });
    });
});
