import { EditChatAdventureUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IEditChatAdventureService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { RoleEnum } from '@domain/entities';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockEditChatAdventureService = {
    editChat: jest.fn()
};

const mockAdventureRepository = {
    updateAdventure: jest.fn()
};

function buildUseCase (): EditChatAdventureUseCase {
    return new EditChatAdventureUseCase(
        mockLogger,
    mockEditChatAdventureService as unknown as IEditChatAdventureService,
    mockAdventureRepository as unknown as IAdventureRepository
    );
}

function buildParams (overrides: Record<string, unknown> = {}) {
    return {
        adventure: createAdventureHelper({ chat: [createChatHelper()] }),
        chatId: 'chat-1',
        content: 'edited message',
        role: RoleEnum.USER,
        characterId: 'character-1',
        ...overrides
    };
}

describe('EditChatAdventureUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the edited adventure and returns the new chat and adventure', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper({ id: 'chat-2', content: ['edited message'] });
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockEditChatAdventureService.editChat.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: true, chat, adventure: updatedAdventure });
        expect(mockEditChatAdventureService.editChat).toHaveBeenCalledWith(expect.objectContaining({ adventure, chatId: 'chat-1' }));
        expect(mockAdventureRepository.updateAdventure).toHaveBeenCalledWith({ adventure: updatedAdventure });
    });

    it('returns the service error without persisting when the chat was not found', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockEditChatAdventureService.editChat.mockReturnValue({
            success: false,
            error: 'Chat with id chat-1 was not found'
        });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 was not found' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns an error when the service succeeds without an adventure', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper({ id: 'chat-2' });

        mockEditChatAdventureService.editChat.mockReturnValue({ success: true, chat });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Service returned success but no adventure object' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when persistence fails', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper({ id: 'chat-2', content: ['edited message'] });
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockEditChatAdventureService.editChat.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false, error: 'Failed to update adventure' });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Failed to update adventure' });
    });

    it('fails when the chat id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ chatId: '' }));

        expect(response).toEqual({ success: false, error: 'Chat id is required' });
        expect(mockEditChatAdventureService.editChat).not.toHaveBeenCalled();
    });

    it('fails when the content is empty', async () => {
        const response = await buildUseCase().execute(buildParams({ content: '   ' }));

        expect(response).toEqual({ success: false, error: 'Content is required to edit a chat' });
        expect(mockEditChatAdventureService.editChat).not.toHaveBeenCalled();
    });

    it('fails when the character id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ characterId: '' }));

        expect(response).toEqual({ success: false, error: 'Character id is required to edit a chat' });
        expect(mockEditChatAdventureService.editChat).not.toHaveBeenCalled();
    });
});
