import { AddChatVersionUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IAddChatVersionService } from '@domain/services';
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

const mockAddChatVersionService = {
    addVersion: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn(),
    updateAdventure: jest.fn()
};

function buildUseCase (): AddChatVersionUseCase {
    return new AddChatVersionUseCase(
        mockLogger,
        mockAddChatVersionService as unknown as IAddChatVersionService,
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
        content: 'edited message',
        ...overrides
    };
}

describe('AddChatVersionUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the new version and only acknowledges the command', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper({ id: 'chat-2', content: ['edited message'] });
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockAddChatVersionService.addVersion.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: true });
        expect(mockAddChatVersionService.addVersion).toHaveBeenCalledWith(expect.objectContaining({ adventure, chatId: 'chat-1' }));
        expect(mockAdventureRepository.updateAdventure).toHaveBeenCalledWith({ adventure: updatedAdventure });
    });

    it('returns the service error without persisting when the chat was not found', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockAddChatVersionService.addVersion.mockReturnValue({
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

        mockAddChatVersionService.addVersion.mockReturnValue({ success: true, chat });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Service returned success but no adventure object' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when persistence fails', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper({ id: 'chat-2', content: ['edited message'] });
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockAddChatVersionService.addVersion.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false, error: 'Failed to update adventure' });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Failed to update adventure' });
    });

    it('fails when the chat id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ chatId: '' }));

        expect(response).toEqual({ success: false, error: 'Chat id is required' });
        expect(mockAddChatVersionService.addVersion).not.toHaveBeenCalled();
    });

    it('fails when the content is empty', async () => {
        const response = await buildUseCase().execute(buildParams({ content: '   ' }));

        expect(response).toEqual({ success: false, error: 'Content is required to add a chat version' });
        expect(mockAddChatVersionService.addVersion).not.toHaveBeenCalled();
    });

    it('uses the role and character stored in the chat instead of trusting the request', async () => {
        const chat = createChatHelper({ id: 'chat-1', role: RoleEnum.ASSISTANT, characterId: 'world-master-1' });
        const adventure = createAdventureHelper({ chat: [chat] });
        mockAddChatVersionService.addVersion.mockReturnValue({ success: true, chat, adventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure });

        await buildUseCase().execute(buildParams({ adventure }));

        expect(mockAddChatVersionService.addVersion).toHaveBeenCalledWith(expect.objectContaining({
            chatId: 'chat-1',
            role: RoleEnum.ASSISTANT,
            characterId: 'world-master-1'
        }));
    });

    it('fails without calling the service when the chat does not exist', async () => {
        const adventure = createAdventureHelper({ chat: [] });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 was not found' });
        expect(mockAddChatVersionService.addVersion).not.toHaveBeenCalled();
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
        expect(mockAddChatVersionService.addVersion).not.toHaveBeenCalled();
    });

    it('fails when the adventure does not exist', async () => {
        const params = buildParams();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: `Adventure with id ${params.adventureId} not found` });
        expect(mockAddChatVersionService.addVersion).not.toHaveBeenCalled();
    });

    it('falls back to a generic error when persistence fails without a message', async () => {
        const params = buildParams();
        mockAddChatVersionService.addVersion.mockReturnValue({ success: true, adventure: params.adventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: 'Failed to save adventure' });
    });
});
