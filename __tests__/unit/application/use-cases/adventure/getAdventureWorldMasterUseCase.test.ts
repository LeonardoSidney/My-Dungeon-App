import { GetAdventureWorldMasterUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createWorldMasterHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('GetAdventureWorldMasterUseCase', () => {
    function build (worldMasterId?: string, stored = createWorldMasterHelper({ id: 'wm' })) {
        const adventure = createAdventureHelper({ worldMasterId });
        const worldMasterRepository = { getWorldMasterById: jest.fn().mockResolvedValue({ success: true, worldMaster: stored }) };
        const useCase = new GetAdventureWorldMasterUseCase(logger, { getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure }) } as never, worldMasterRepository as never);
        return { adventure, useCase, worldMasterRepository };
    }

    it('reads the world master the adventure points to', async () => {
        const { adventure, useCase, worldMasterRepository } = build('wm');

        const response = await useCase.execute({ adventureId: adventure.id });

        expect(worldMasterRepository.getWorldMasterById).toHaveBeenCalledWith('wm');
        expect(response.worldMaster?.id).toBe('wm');
    });

    it('succeeds without a world master when the adventure has none', async () => {
        const { adventure, useCase, worldMasterRepository } = build(undefined);

        const response = await useCase.execute({ adventureId: adventure.id });

        expect(response).toEqual({ success: true });
        expect(worldMasterRepository.getWorldMasterById).not.toHaveBeenCalled();
    });

    it('fails when the referenced world master no longer exists', async () => {
        const { adventure, useCase } = build('wm', null as never);

        const response = await useCase.execute({ adventureId: adventure.id });

        expect(response).toEqual({ success: false, error: 'World master with id wm not found' });
    });

    it('fails without reading the adventure when the id is blank', async () => {
        const adventureRepository = { getAdventureById: jest.fn() };
        const useCase = new GetAdventureWorldMasterUseCase(logger, adventureRepository as never, {} as never);

        const response = await useCase.execute({ adventureId: ' ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it.each([
        [{ success: false, error: 'storage offline' }, 'storage offline'],
        [{ success: true, adventure: undefined }, 'Adventure with id adventure-1 not found']
    ])('fails when loading the adventure answers %j', async (adventureResponse, error) => {
        const useCase = new GetAdventureWorldMasterUseCase(logger, { getAdventureById: jest.fn().mockResolvedValue(adventureResponse) } as never, {} as never);

        const response = await useCase.execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error });
    });

    it('propagates a failure to load the world master', async () => {
        const { adventure, useCase, worldMasterRepository } = build('wm');
        worldMasterRepository.getWorldMasterById.mockResolvedValue({ success: false, error: 'corrupted world master' });

        const response = await useCase.execute({ adventureId: adventure.id });

        expect(response).toEqual({ success: false, error: 'corrupted world master' });
    });
});
