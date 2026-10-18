import { DeleteThinkAdventureUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IDeleteThinkAdventureService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockDeleteThinkAdventureService = {
    deleteThink: jest.fn()
};

const mockAdventureRepository = {
    updateAdventure: jest.fn()
};

function buildUseCase (): DeleteThinkAdventureUseCase {
    return new DeleteThinkAdventureUseCase(
        mockLogger,
        mockDeleteThinkAdventureService as unknown as IDeleteThinkAdventureService,
        mockAdventureRepository as unknown as IAdventureRepository
    );
}

function buildParams (overrides: Record<string, unknown> = {}) {
    const adventure = createAdventureHelper({
        chat: [createChatHelper({
            think: [
                { id: 't0', content: 'zero', enabled: true },
                { id: 't1', content: 'one', enabled: true }
            ],
            thinkIndex: 1
        })]
    });

    return {
        adventure,
        chatId: 'chat-1',
        index: 1,
        ...overrides
    };
}

describe('DeleteThinkAdventureUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the deleted adventure and returns the new chat and adventure', async () => {
        const { adventure } = buildParams();
        const chat = createChatHelper({
            think: [{ id: 't0', content: 'zero', enabled: true }],
            thinkIndex: 0
        });
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockDeleteThinkAdventureService.deleteThink.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams());

        expect(response).toEqual({ success: true, chat, adventure: updatedAdventure });
        expect(mockDeleteThinkAdventureService.deleteThink).toHaveBeenCalledWith(expect.objectContaining({ adventure, chatId: 'chat-1', index: 1 }));
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
        expect(mockDeleteThinkAdventureService.deleteThink).not.toHaveBeenCalled();
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the service error without persisting when the chat has no thinks', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockDeleteThinkAdventureService.deleteThink.mockReturnValue({
            success: false,
            error: 'Chat with id chat-1 has no think versions to delete'
        });

        const response = await buildUseCase().execute(buildParams({ adventure, index: 0 }));

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 has no think versions to delete' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns an error when the service succeeds without an adventure', async () => {
        const chat = createChatHelper();

        mockDeleteThinkAdventureService.deleteThink.mockReturnValue({ success: true, chat });

        const response = await buildUseCase().execute(buildParams());

        expect(response).toEqual({ success: false, error: 'Service returned success but no adventure object' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when persistence fails', async () => {
        const { adventure } = buildParams();
        const chat = createChatHelper();
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockDeleteThinkAdventureService.deleteThink.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false, error: 'Failed to update adventure' });

        const response = await buildUseCase().execute(buildParams());

        expect(response).toEqual({ success: false, error: 'Failed to update adventure' });
    });

    it('fails when the chat id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ chatId: '' }));

        expect(response).toEqual({ success: false, error: 'Chat id is required' });
        expect(mockDeleteThinkAdventureService.deleteThink).not.toHaveBeenCalled();
    });
});
