import { EditThinkAdventureUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IEditThinkAdventureService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockEditThinkAdventureService = {
    editThink: jest.fn()
};

const mockAdventureRepository = {
    updateAdventure: jest.fn()
};

function buildUseCase (): EditThinkAdventureUseCase {
    return new EditThinkAdventureUseCase(
        mockLogger,
        mockEditThinkAdventureService as unknown as IEditThinkAdventureService,
        mockAdventureRepository as unknown as IAdventureRepository
    );
}

function buildParams (overrides: Record<string, unknown> = {}) {
    return {
        adventure: createAdventureHelper({ chat: [createChatHelper()] }),
        chatId: 'chat-1',
        content: 'a refined note',
        ...overrides
    };
}

describe('EditThinkAdventureUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the edited adventure and returns the new chat and adventure', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper({
            think: [{ id: 'think-new', content: 'a refined note', enabled: true }],
            thinkIndex: 0
        });
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockEditThinkAdventureService.editThink.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: true, chat, adventure: updatedAdventure });
        expect(mockEditThinkAdventureService.editThink).toHaveBeenCalledWith(expect.objectContaining({ adventure, chatId: 'chat-1' }));
        expect(mockAdventureRepository.updateAdventure).toHaveBeenCalledWith({ adventure: updatedAdventure });
    });

    it('returns the service error without persisting when the chat was not found', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockEditThinkAdventureService.editThink.mockReturnValue({
            success: false,
            error: 'Chat with id chat-1 was not found'
        });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 was not found' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns an error when the service succeeds without an adventure', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper();

        mockEditThinkAdventureService.editThink.mockReturnValue({ success: true, chat });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Service returned success but no adventure object' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when persistence fails', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper();
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockEditThinkAdventureService.editThink.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false, error: 'Failed to update adventure' });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Failed to update adventure' });
    });

    it('fails when the chat id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ chatId: '' }));

        expect(response).toEqual({ success: false, error: 'Chat id is required' });
        expect(mockEditThinkAdventureService.editThink).not.toHaveBeenCalled();
    });

    it('fails when the content is empty', async () => {
        const response = await buildUseCase().execute(buildParams({ content: '   ' }));

        expect(response).toEqual({ success: false, error: 'Content is required to edit a think' });
        expect(mockEditThinkAdventureService.editThink).not.toHaveBeenCalled();
    });
});
