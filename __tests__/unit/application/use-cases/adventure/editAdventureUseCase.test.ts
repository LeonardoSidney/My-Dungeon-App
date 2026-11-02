import { EditAdventureUseCase } from '@application/use-cases';
import { EditAdventureService } from '@application/services';
import { IEditAdventureService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createAdventureRequestHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const REQUEST = createAdventureRequestHelper({ playableCharacterIds: ['hero'], aiControlledCharacterIds: ['npc'] });

function buildRepositories () {
    const found = {
        getCharacterById: jest.fn(async (id: string) => ({ success: true, character: { id } })),
        getWorldMasterById: jest.fn().mockResolvedValue({ success: true, worldMaster: {} }),
        getSystemPromptById: jest.fn().mockResolvedValue({ success: true, systemPrompt: {} }),
        getWorldById: jest.fn().mockResolvedValue({ success: true, world: {} }),
        getLocationById: jest.fn().mockResolvedValue({ success: true, location: {} }),
        getItemById: jest.fn().mockResolvedValue({ success: true, item: {} }),
    };
    const adventureRepository = {
        getAdventureIndex: jest.fn().mockResolvedValue({ success: true, entries: [] }),
        getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure: createAdventureHelper({ id: 'adv-1' }) }),
        saveAdventure: jest.fn().mockResolvedValue({ success: true }),
        updateAdventure: jest.fn().mockResolvedValue({ success: true }),
    };
    return { found, adventureRepository };
}

function buildEdit (service?: IEditAdventureService) {
    const { found, adventureRepository } = buildRepositories();
    const useCase = new EditAdventureUseCase(
        logger,
        service ?? new EditAdventureService(logger),
        adventureRepository as never,
        found as never,
        found as never,
        found as never,
        found as never,
        found as never,
        found as never
    );
    return { useCase, found, adventureRepository };
}

describe('EditAdventureUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('validates the references of the edited cast before saving', async () => {
        const { useCase, found, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: true, id: 'adv-1' });
        expect(found.getCharacterById.mock.calls.map(([id]) => id)).toEqual(['hero', 'npc']);
        expect(adventureRepository.updateAdventure).toHaveBeenCalledWith({
            adventure: expect.objectContaining({ id: 'adv-1', characterIds: ['hero', 'npc'] }),
        });
    });

    it('fails when the id is blank', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: ' ', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('fails when the name is blank', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, name: ' ' } });

        expect(response).toEqual({ success: false, error: 'Adventure name is required' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventure cannot be loaded', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureById.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Database error' });
    });

    it('fails when the adventure does not exist', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Adventure with id adv-1 not found' });
    });

    it('fails without saving when the service answers { success: false, error: "Invalid cast" }', async () => {
        const serviceResponse = { success: false, error: 'Invalid cast' };

        const { useCase, adventureRepository } = buildEdit({ editAdventure: jest.fn().mockReturnValue(serviceResponse) });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Invalid cast' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('fails without saving when the service answers { success: false }', async () => {
        const serviceResponse = { success: false };

        const { useCase, adventureRepository } = buildEdit({ editAdventure: jest.fn().mockReturnValue(serviceResponse) });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditAdventureService' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('fails without saving when the service answers { success: true }', async () => {
        const serviceResponse = { success: true };

        const { useCase, adventureRepository } = buildEdit({ editAdventure: jest.fn().mockReturnValue(serviceResponse) });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have an adventure' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when a character of the cast cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getCharacterById.mockResolvedValueOnce({ success: false, error: 'Failed to load characters' } as never);

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to load characters' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getWorldMasterById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getWorldMasterById.mockResolvedValue({ success: true });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from World Masters' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getSystemPromptById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getSystemPromptById.mockResolvedValue({ success: true });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from System Prompts' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getWorldById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getWorldById.mockResolvedValue({ success: true });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from Worlds' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getLocationById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getLocationById.mockResolvedValue({ success: true });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from Locations' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getItemById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getItemById.mockResolvedValue({ success: true });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from Items' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventures cannot be loaded', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureIndex.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('fails when another adventure already has the new name', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureIndex.mockResolvedValue({
            success: true,
            entries: [createAdventureHelper({ id: 'adv-1', name: REQUEST.name }), createAdventureHelper({ id: 'adv-2', name: REQUEST.name })]
        });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: `Adventure with name ${REQUEST.name} already exists` });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('keeps the name of the adventure being edited', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureIndex.mockResolvedValue({
            success: true,
            entries: [createAdventureHelper({ id: 'adv-1', name: REQUEST.name })]
        });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: true, id: 'adv-1' });
    });

    it('fails when saving answers { success: false, error: "Disk full" }', async () => {
        const updateResponse = { success: false, error: 'Disk full' };

        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.updateAdventure.mockResolvedValue(updateResponse);

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('fails when saving answers { success: false }', async () => {
        const updateResponse = { success: false };

        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.updateAdventure.mockResolvedValue(updateResponse);

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to save edited adventure' });
    });
});
