import { EditAdventureUseCase } from '@application/use-cases';
import { EditAdventureService, ValidateAdventureCharacterSelectionService, ValidateUniqueIdsService } from '@application/services';
import { IEditAdventureService, IValidateAdventureCharacterSelectionService } from '@domain/services';
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

function buildEdit (service?: IEditAdventureService, validateSelectionService?: IValidateAdventureCharacterSelectionService) {
    const { found, adventureRepository } = buildRepositories();
    const useCase = new EditAdventureUseCase(
        logger,
        service ?? new EditAdventureService(logger),
        validateSelectionService ?? new ValidateAdventureCharacterSelectionService(logger),
        new ValidateUniqueIdsService(logger),
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

    it('saves every field of the adventure edited by the service', async () => {
        const { useCase, adventureRepository } = buildEdit();

        await useCase.execute({
            id: 'adv-1',
            editParams: {
                ...REQUEST,
                systemPromptIds: ['prompt'],
                worldIds: ['world'],
                locationIds: ['location'],
                itemIds: ['item'],
            },
        });

        expect(adventureRepository.updateAdventure).toHaveBeenCalledWith({
            adventure: expect.objectContaining({
                id: 'adv-1',
                name: REQUEST.name,
                systemPromptIds: ['prompt'],
                worldIds: ['world'],
                locationIds: ['location'],
                itemIds: ['item'],
            }),
        });
    });

    it('validates a character acting as world master as part of the cast', async () => {
        const { useCase, found } = buildEdit();

        const response = await useCase.execute({
            id: 'adv-1',
            editParams: { ...REQUEST, worldMasterId: undefined, characterAsWorldMasterId: 'narrator' },
        });

        expect(response).toEqual({ success: true, id: 'adv-1' });
        expect(found.getCharacterById.mock.calls.map(([id]) => id)).toEqual(['hero', 'npc', 'narrator']);
        expect(found.getWorldMasterById).not.toHaveBeenCalled();
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

    it('fails before loading the adventure when a playable character id is repeated', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, playableCharacterIds: ['hero', 'hero'] } });

        expect(response).toEqual({ success: false, error: 'Repeated id: hero from Characters' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('fails before loading the adventure when an AI controlled character id is repeated', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, aiControlledCharacterIds: ['npc', 'npc'] } });

        expect(response).toEqual({ success: false, error: 'Repeated id: npc from Characters' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('fails before loading the adventure when a system prompt id is repeated', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, systemPromptIds: ['prompt', 'prompt'] } });

        expect(response).toEqual({ success: false, error: 'Repeated id: prompt from System Prompts' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('fails before loading the adventure when a world id is repeated', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, worldIds: ['world', 'world'] } });

        expect(response).toEqual({ success: false, error: 'Repeated id: world from Worlds' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('fails before loading the adventure when a location id is repeated', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, locationIds: ['location', 'location'] } });

        expect(response).toEqual({ success: false, error: 'Repeated id: location from Locations' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('fails before loading the adventure when an item id is repeated', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, itemIds: ['item', 'item'] } });

        expect(response).toEqual({ success: false, error: 'Repeated id: item from Items' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('accepts a character listed as playable and AI controlled at the same time', async () => {
        const { useCase } = buildEdit();

        const response = await useCase.execute({
            id: 'adv-1',
            editParams: { ...REQUEST, playableCharacterIds: ['hero', 'npc'], aiControlledCharacterIds: ['npc'] },
        });

        expect(response).toEqual({ success: true, id: 'adv-1' });
    });

    it('fails before loading the adventure when there is no system prompt', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, systemPromptIds: [] } });

        expect(response).toEqual({ success: false, error: 'A system prompt is required' });
        expect(adventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventure cannot be loaded', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureById.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Database error' });
    });

    it('returns a fallback error when the adventure cannot be loaded and there is no error', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureById.mockResolvedValue({ success: false });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to load adventure' });
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

    it('fails without saving when the edited cast breaks the character rules', async () => {
        const { useCase, found, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, playableCharacterIds: [] } });

        expect(response).toEqual({ success: false, error: 'You need at least 1 playable character' });
        expect(found.getCharacterById).not.toHaveBeenCalled();
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('fails without saving when the edited cast has both kinds of world master', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({
            id: 'adv-1',
            editParams: { ...REQUEST, worldMasterId: 'master', characterAsWorldMasterId: 'narrator' },
        });

        expect(response).toEqual({ success: false, error: 'An adventure cannot have both a world master and a character acting as world master' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('fails without saving when the edited cast has no world master at all', async () => {
        const { useCase, adventureRepository } = buildEdit();

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, worldMasterId: undefined } });

        expect(response).toEqual({ success: false, error: 'An adventure without a world master needs a character acting as world master' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('sends the adventure edited by the service to the character selection validation', async () => {
        const validate = jest.fn().mockReturnValue({ success: false, error: 'Invalid selection' });
        const { useCase, adventureRepository } = buildEdit(undefined, { validate });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(validate).toHaveBeenCalledWith(expect.objectContaining({ characterIds: ['hero', 'npc'], charactersControlledByAi: ['npc'] }));
        expect(response).toEqual({ success: false, error: 'Invalid selection' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when a character of the cast does not exist', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getCharacterById.mockResolvedValueOnce({ success: true } as never);

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response.success).toBe(false);
        expect(response.error).toContain('hero');
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

    it('does not save when getWorldMasterById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getWorldMasterById.mockResolvedValue({ success: false, error: 'Failed to load world masters' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to load world masters' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getSystemPromptById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getSystemPromptById.mockResolvedValue({ success: false, error: 'Failed to load system prompts' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to load system prompts' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getWorldById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getWorldById.mockResolvedValue({ success: false, error: 'Failed to load worlds' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to load worlds' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getLocationById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getLocationById.mockResolvedValue({ success: false, error: 'Failed to load locations' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to load locations' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getItemById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildEdit();
        found.getItemById.mockResolvedValue({ success: false, error: 'Failed to load items' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to load items' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventures cannot be loaded', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureIndex.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('returns a fallback error when the adventure index has no entries', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureIndex.mockResolvedValue({ success: true });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: false, error: 'Failed to load adventures' });
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

    it('compares the trimmed name against the existing adventures', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureIndex.mockResolvedValue({
            success: true,
            entries: [createAdventureHelper({ id: 'adv-2', name: REQUEST.name })]
        });

        const response = await useCase.execute({ id: 'adv-1', editParams: { ...REQUEST, name: `  ${REQUEST.name}  ` } });

        expect(response).toEqual({ success: false, error: `Adventure with name ${REQUEST.name} already exists` });
        expect(adventureRepository.updateAdventure).not.toHaveBeenCalled();
    });

    it('treats names that differ only by case as different names', async () => {
        const { useCase, adventureRepository } = buildEdit();
        adventureRepository.getAdventureIndex.mockResolvedValue({
            success: true,
            entries: [createAdventureHelper({ id: 'adv-2', name: REQUEST.name.toUpperCase() })]
        });

        const response = await useCase.execute({ id: 'adv-1', editParams: REQUEST });

        expect(response).toEqual({ success: true, id: 'adv-1' });
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
