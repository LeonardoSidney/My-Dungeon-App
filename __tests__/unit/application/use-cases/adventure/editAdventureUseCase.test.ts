import { EditAdventureUseCase } from '@application/use-cases';
import { EditAdventureService } from '@application/services';
import { IEditAdventureService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createAdventureRequestHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
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
        getAdventures: jest.fn().mockResolvedValue({ success: true, adventures: [] }),
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

    it.each([
        [{ success: false, error: 'Invalid cast' }, 'Invalid cast'],
        [{ success: false }, 'An unknown error occurred on EditAdventureService'],
        [{ success: true }, 'Success is true but does not have an adventure']
    ])('fails without saving when the service answers %j', async (serviceResponse, error) => {
        const { useCase, adventureRepository } = buildEdit({ editAdventure: jest.fn().mockReturnValue(serviceResponse) });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when a character of the cast cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getCharacterById.mockResolvedValueOnce({ success: false, error: 'Failed to load characters' } as never);

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to load characters' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it.each([
        ['getWorldMasterById', 'WorldMaster'],
        ['getSystemPromptById', 'SystemPrompt'],
        ['getWorldById', 'World'],
        ['getLocationById', 'Location'],
        ['getItemById', 'Item']
    ] as const)('does not save when %s does not find the referenced entity', async (method, label) => {
        const { useCase, found, adventureRepository } = buildEdit();
        found[method].mockResolvedValue({ success: true });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: `${label} not found: 1` });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventures cannot be loaded', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventures.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('fails when another adventure already has the new name', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventures.mockResolvedValue({
            success: true,
            adventures: [createAdventureHelper({ id: 'adv-1', name: REQUEST.name }), createAdventureHelper({ id: 'adv-2', name: REQUEST.name })]
        });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: `Adventure with name ${REQUEST.name} already exists` });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('keeps the name of the adventure being edited', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventures.mockResolvedValue({
            success: true,
            adventures: [createAdventureHelper({ id: 'adv-1', name: REQUEST.name })]
        });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: true, id: 'adv-1' });
    });

    it.each([
        [{ success: false, error: 'Disk full' }, 'Disk full'],
        [{ success: false }, 'Failed to save edited adventure']
    ])('fails when saving answers %j', async (updateResponse, error) => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.updateAdventure.mockResolvedValue(updateResponse);

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error });
    });
});
