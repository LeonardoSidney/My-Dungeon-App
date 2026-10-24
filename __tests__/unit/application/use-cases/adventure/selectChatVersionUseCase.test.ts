import { SelectChatVersionUseCase } from '@application/use-cases';
import { SelectChatVersionService } from '@application/services';
import { IAdventureRepository } from '@domain/repository';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn(),
    updateAdventure: jest.fn().mockResolvedValue({ success: true })
};

function buildUseCase (): SelectChatVersionUseCase {
    return new SelectChatVersionUseCase(
        mockLogger,
        new SelectChatVersionService(mockLogger),
        mockAdventureRepository as unknown as IAdventureRepository
    );
}

describe('SelectChatVersionUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('moves the content version by the requested direction', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({
            chat: [createChatHelper({ content: ['a', 'b', 'c'], index: 1 })]
        }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind: 'content' });

        expect(response).toEqual({ success: true });
        expect(mockAdventureRepository.updateAdventure.mock.calls[0][0].adventure.chat[0].index).toBe(2);
    });

    it('moves the think version by the requested direction', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({
            chat: [createChatHelper({
                think: [{ id: 't0', content: 'a', enabled: true }, { id: 't1', content: 'b', enabled: true }],
                thinkIndex: 1
            })]
        }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1', chatId: 'chat-1', direction: -1, kind: 'think' });

        expect(response).toEqual({ success: true });
        expect(mockAdventureRepository.updateAdventure.mock.calls[0][0].adventure.chat[0].thinkIndex).toBe(0);
    });

    it('is a no-op without persisting when already at the boundary', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({
            chat: [createChatHelper({ content: ['a', 'b'], index: 1 })]
        }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind: 'content' });

        expect(response).toEqual({ success: true });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('fails when the chat does not exist', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({ chat: [] }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind: 'content' });

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 was not found' });
    });

    it('fails when the adventure id is blank', async () => {
        const response = await buildUseCase().execute({ adventureId: '   ', chatId: 'chat-1', direction: 1, kind: 'content' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(mockAdventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventure cannot be loaded', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind: 'content' });

        expect(response).toEqual({ success: false, error: 'Database error' });
    });

    it('fails when the adventure does not exist', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind: 'content' });

        expect(response).toEqual({ success: false, error: 'Adventure with id adventure-1 not found' });
    });

    it('is a no-op when the chat has no think versions', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({
            chat: [createChatHelper({ think: undefined, thinkIndex: 0 })]
        }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind: 'think' });

        expect(response).toEqual({ success: true });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it.each([
        [{ success: false, error: 'Selection failed' }, 'Selection failed'],
        [{ success: false }, 'Failed to select chat version'],
        [{ success: true }, 'Failed to select chat version']
    ])('returns an error without persisting when the service answers %j', async (serviceResponse, error) => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({
            chat: [createChatHelper({ content: ['a', 'b'], index: 0 })]
        }) });
        const useCase = new SelectChatVersionUseCase(
            mockLogger,
            { selectVersion: jest.fn().mockReturnValue(serviceResponse) },
            mockAdventureRepository as unknown as IAdventureRepository
        );

        const response = await useCase.execute({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind: 'content' });

        expect(response).toEqual({ success: false, error });
        expect(mockAdventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it.each([
        [{ success: false, error: 'Disk full' }, 'Disk full'],
        [{ success: false }, 'Failed to save selected chat version']
    ])('returns an error when persistence answers %j', async (updateResponse, error) => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({
            chat: [createChatHelper({ content: ['a', 'b'], index: 0 })]
        }) });
        mockAdventureRepository.updateAdventure.mockResolvedValueOnce(updateResponse);

        const response = await buildUseCase().execute({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind: 'content' });

        expect(response).toEqual({ success: false, error });
    });
});
