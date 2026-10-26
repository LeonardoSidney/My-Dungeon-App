import { StartStreamingChatUseCase } from '@application/use-cases';
import { RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const PARAMS = { adventureId: 'adv-1', role: RoleEnum.ASSISTANT, characterId: 'narrator', modelId: 'qwen3' };

function buildUseCase () {
    const adventure = createAdventureHelper({ id: 'adv-1' });
    const chat = createChatHelper({ id: 'chat-new', role: RoleEnum.ASSISTANT, modelId: 'qwen3' });
    const updatedAdventure = { ...adventure, chat: [chat] };
    const service = { startStreamingChat: jest.fn().mockReturnValue({ success: true, chat, adventure: updatedAdventure }) };
    const repository = {
        getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure }),
        updateAdventure: jest.fn().mockResolvedValue({ success: true }),
    };
    const useCase = new StartStreamingChatUseCase(logger, service, repository as never);
    return { useCase, service, repository, adventure, chat, updatedAdventure };
}

describe('StartStreamingChatUseCase', () => {
    it('starts the streaming chat with the model and saves the adventure', async () => {
        const { useCase, service, repository, adventure, chat, updatedAdventure } = buildUseCase();

        const response = await useCase.execute({ ...PARAMS, chatId: 'chat-1' });

        expect(service.startStreamingChat).toHaveBeenCalledWith({
            adventure,
            role: RoleEnum.ASSISTANT,
            characterId: 'narrator',
            chatId: 'chat-1',
            modelId: 'qwen3',
        });
        expect(repository.updateAdventure).toHaveBeenCalledWith({ adventure: updatedAdventure });
        expect(response).toEqual({ success: true, chat, adventure: updatedAdventure });
    });

    it.each([
        [{ adventureId: ' ' }, 'Adventure id is required'],
        [{ characterId: ' ' }, 'Character id is required'],
    ])('fails without loading anything when the params are %j', async (override, error) => {
        const { useCase, repository } = buildUseCase();

        const response = await useCase.execute({ ...PARAMS, ...override });

        expect(response).toEqual({ success: false, error });
        expect(repository.getAdventureById).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventure cannot be loaded', async () => {
        const { useCase, repository } = buildUseCase();
        repository.getAdventureById.mockResolvedValue({ success: false, error: 'Storage unavailable' });

        expect(await useCase.execute(PARAMS)).toEqual({ success: false, error: 'Storage unavailable' });
    });

    it('fails when the adventure does not exist', async () => {
        const { useCase, repository } = buildUseCase();
        repository.getAdventureById.mockResolvedValue({ success: true });

        expect(await useCase.execute(PARAMS)).toEqual({ success: false, error: 'Adventure with id adv-1 not found' });
    });

    it('returns the service error without saving', async () => {
        const { useCase, service, repository } = buildUseCase();
        service.startStreamingChat.mockReturnValue({ success: false, error: 'Chat not found in adventure' });

        expect(await useCase.execute(PARAMS)).toEqual({ success: false, error: 'Chat not found in adventure' });
        expect(repository.updateAdventure).not.toHaveBeenCalled();
    });

    it('fails when the service succeeds without an adventure', async () => {
        const { useCase, service } = buildUseCase();
        service.startStreamingChat.mockReturnValue({ success: true });

        expect(await useCase.execute(PARAMS)).toEqual({ success: false, error: 'Service returned success but no adventure object' });
    });

    it.each([
        [{ success: false, error: 'Disk full' }, 'Disk full'],
        [{ success: false }, 'Failed to save adventure'],
    ])('returns the save error when the update answers %j', async (update, error) => {
        const { useCase, repository } = buildUseCase();
        repository.updateAdventure.mockResolvedValue(update);

        expect(await useCase.execute(PARAMS)).toEqual({ success: false, error });
    });
});
