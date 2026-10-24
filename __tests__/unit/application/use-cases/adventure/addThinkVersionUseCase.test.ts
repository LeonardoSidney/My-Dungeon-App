import { AddThinkVersionUseCase } from '@application/use-cases';
import { IAdventureRepository } from '@domain/repository';
import { IAddThinkVersionService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockAddThinkVersionService = {
    addVersion: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn(),
    updateAdventure: jest.fn()
};

function buildUseCase (): AddThinkVersionUseCase {
    return new AddThinkVersionUseCase(
        mockLogger,
        mockAddThinkVersionService as unknown as IAddThinkVersionService,
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
        content: 'a refined note',
        ...overrides
    };
}

describe('AddThinkVersionUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('persists the new version and only acknowledges the command', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper({
            think: [{ id: 'think-new', content: 'a refined note', enabled: true }],
            thinkIndex: 0
        });
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockAddThinkVersionService.addVersion.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: true, adventure: updatedAdventure });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: true });
        expect(mockAddThinkVersionService.addVersion).toHaveBeenCalledWith(expect.objectContaining({ adventure, chatId: 'chat-1' }));
        expect(mockAdventureRepository.updateAdventure).toHaveBeenCalledWith({ adventure: updatedAdventure });
    });

    it('returns the service error without persisting when the chat was not found', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        mockAddThinkVersionService.addVersion.mockReturnValue({
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

        mockAddThinkVersionService.addVersion.mockReturnValue({ success: true, chat });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Service returned success but no adventure object' });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when persistence fails', async () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });
        const chat = createChatHelper();
        const updatedAdventure = { ...adventure, chat: [chat] };

        mockAddThinkVersionService.addVersion.mockReturnValue({ success: true, chat, adventure: updatedAdventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false, error: 'Failed to update adventure' });

        const response = await buildUseCase().execute(buildParams({ adventure }));

        expect(response).toEqual({ success: false, error: 'Failed to update adventure' });
    });

    it('fails when the chat id is missing', async () => {
        const response = await buildUseCase().execute(buildParams({ chatId: '' }));

        expect(response).toEqual({ success: false, error: 'Chat id is required' });
        expect(mockAddThinkVersionService.addVersion).not.toHaveBeenCalled();
    });

    it('fails when the content is empty', async () => {
        const response = await buildUseCase().execute(buildParams({ content: '   ' }));

        expect(response).toEqual({ success: false, error: 'Content is required to add a think version' });
        expect(mockAddThinkVersionService.addVersion).not.toHaveBeenCalled();
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
        expect(mockAddThinkVersionService.addVersion).not.toHaveBeenCalled();
    });

    it('fails when the adventure does not exist', async () => {
        const params = buildParams();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: `Adventure with id ${params.adventureId} not found` });
        expect(mockAddThinkVersionService.addVersion).not.toHaveBeenCalled();
    });

    it('falls back to a generic error when persistence fails without a message', async () => {
        const params = buildParams();
        mockAddThinkVersionService.addVersion.mockReturnValue({ success: true, adventure: params.adventure });
        mockAdventureRepository.updateAdventure.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute(params);

        expect(response).toEqual({ success: false, error: 'Failed to save adventure' });
    });
});
