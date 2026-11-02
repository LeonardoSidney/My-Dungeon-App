import { CreateAdventureUseCase } from '@application/use-cases';
import { CreateAdventureService, ValidateAdventureCharacterSelectionService, ValidateUniqueIdsService } from '@application/services';
import { ICreateAdventureService, IValidateAdventureCharacterSelectionService } from '@domain/services';
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

function buildRepositories (missingCharacter?: string) {
    const found = {
        getCharacterById: jest.fn(async (id: string) => ({ success: true, character: id === missingCharacter ? undefined : { id } })),
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

function buildCreate (
    missingCharacter?: string,
    service?: ICreateAdventureService,
    validateSelectionService?: IValidateAdventureCharacterSelectionService
) {
    const { found, adventureRepository } = buildRepositories(missingCharacter);
    const idGenerator = { generate: jest.fn().mockReturnValue('adv-1') };
    const useCase = new CreateAdventureUseCase(
        logger,
        service ?? new CreateAdventureService(logger, idGenerator),
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

describe('CreateAdventureUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('validates the references of the cast built by the service and saves it', async () => {
        const { useCase, found, adventureRepository } = buildCreate();

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: true, id: 'adv-1' });
        expect(found.getCharacterById.mock.calls.map(([id]) => id)).toEqual(['hero', 'npc']);
        expect(adventureRepository.saveAdventure).toHaveBeenCalledWith({
            adventure: expect.objectContaining({ characterIds: ['hero', 'npc'], charactersControlledByAi: ['npc'] }),
        });
    });

    it('saves every field of the adventure built by the service', async () => {
        const { useCase, adventureRepository } = buildCreate();

        await useCase.execute({
            ...REQUEST,
            systemPromptIds: ['prompt'],
            worldIds: ['world'],
            locationIds: ['location'],
            itemIds: ['item'],
        });

        expect(adventureRepository.saveAdventure).toHaveBeenCalledWith({
            adventure: expect.objectContaining({
                id: 'adv-1',
                name: REQUEST.name,
                chat: [],
                systemPromptIds: ['prompt'],
                worldIds: ['world'],
                locationIds: ['location'],
                itemIds: ['item'],
            }),
        });
    });

    it('validates a character acting as world master as part of the cast', async () => {
        const { useCase, found } = buildCreate();

        const response = await useCase.execute({ ...REQUEST, worldMasterId: undefined, characterAsWorldMasterId: 'narrator' });

        expect(response).toEqual({ success: true, id: 'adv-1' });
        expect(found.getCharacterById.mock.calls.map(([id]) => id)).toEqual(['hero', 'npc', 'narrator']);
        expect(found.getWorldMasterById).not.toHaveBeenCalled();
    });

    it('does not save when a character of the cast does not exist', async () => {
        const { useCase, adventureRepository } = buildCreate('npc');

        const response = await useCase.execute(REQUEST);

        expect(response.success).toBe(false);
        expect(response.error).toContain('npc');
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when a referenced entity cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getCharacterById.mockResolvedValueOnce({ success: false, error: 'Failed to load characters' } as never);

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Failed to load characters' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('fails when the name is blank', async () => {
        const { useCase, found } = buildCreate();

        const response = await useCase.execute({ ...REQUEST, name: '   ' });

        expect(response).toEqual({ success: false, error: 'A name for an adventure is required' });
        expect(found.getCharacterById).not.toHaveBeenCalled();
    });

    it('fails before building the adventure when a playable character id is repeated', async () => {
        const createAdventure = jest.fn();
        const { useCase } = buildCreate(undefined, { createAdventure });

        const response = await useCase.execute({ ...REQUEST, playableCharacterIds: ['hero', 'hero'] });

        expect(response).toEqual({ success: false, error: 'Repeated id: hero from Characters' });
        expect(createAdventure).not.toHaveBeenCalled();
    });

    it('fails before building the adventure when an AI controlled character id is repeated', async () => {
        const createAdventure = jest.fn();
        const { useCase } = buildCreate(undefined, { createAdventure });

        const response = await useCase.execute({ ...REQUEST, aiControlledCharacterIds: ['npc', 'npc'] });

        expect(response).toEqual({ success: false, error: 'Repeated id: npc from Characters' });
        expect(createAdventure).not.toHaveBeenCalled();
    });

    it('fails before building the adventure when a system prompt id is repeated', async () => {
        const createAdventure = jest.fn();
        const { useCase } = buildCreate(undefined, { createAdventure });

        const response = await useCase.execute({ ...REQUEST, systemPromptIds: ['prompt', 'prompt'] });

        expect(response).toEqual({ success: false, error: 'Repeated id: prompt from System Prompts' });
        expect(createAdventure).not.toHaveBeenCalled();
    });

    it('fails before building the adventure when a world id is repeated', async () => {
        const createAdventure = jest.fn();
        const { useCase } = buildCreate(undefined, { createAdventure });

        const response = await useCase.execute({ ...REQUEST, worldIds: ['world', 'world'] });

        expect(response).toEqual({ success: false, error: 'Repeated id: world from Worlds' });
        expect(createAdventure).not.toHaveBeenCalled();
    });

    it('fails before building the adventure when a location id is repeated', async () => {
        const createAdventure = jest.fn();
        const { useCase } = buildCreate(undefined, { createAdventure });

        const response = await useCase.execute({ ...REQUEST, locationIds: ['location', 'location'] });

        expect(response).toEqual({ success: false, error: 'Repeated id: location from Locations' });
        expect(createAdventure).not.toHaveBeenCalled();
    });

    it('fails before building the adventure when an item id is repeated', async () => {
        const createAdventure = jest.fn();
        const { useCase } = buildCreate(undefined, { createAdventure });

        const response = await useCase.execute({ ...REQUEST, itemIds: ['item', 'item'] });

        expect(response).toEqual({ success: false, error: 'Repeated id: item from Items' });
        expect(createAdventure).not.toHaveBeenCalled();
    });

    it('accepts a character listed as playable and AI controlled at the same time', async () => {
        const { useCase } = buildCreate();

        const response = await useCase.execute({ ...REQUEST, playableCharacterIds: ['hero', 'npc'], aiControlledCharacterIds: ['npc'] });

        expect(response).toEqual({ success: true, id: 'adv-1' });
    });

    it('fails before building the adventure when there is no system prompt', async () => {
        const createAdventure = jest.fn();
        const { useCase } = buildCreate(undefined, { createAdventure });

        const response = await useCase.execute({ ...REQUEST, systemPromptIds: [] });

        expect(response).toEqual({ success: false, error: 'A system prompt is required' });
        expect(createAdventure).not.toHaveBeenCalled();
    });

    it('fails without saving when the cast breaks the character rules', async () => {
        const { useCase, found, adventureRepository } = buildCreate();

        const response = await useCase.execute({ ...REQUEST, playableCharacterIds: [] });

        expect(response).toEqual({ success: false, error: 'You need at least 1 playable character' });
        expect(found.getCharacterById).not.toHaveBeenCalled();
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('fails without saving when the cast has both kinds of world master', async () => {
        const { useCase, adventureRepository } = buildCreate();

        const response = await useCase.execute({ ...REQUEST, worldMasterId: 'master', characterAsWorldMasterId: 'narrator' });

        expect(response).toEqual({ success: false, error: 'An adventure cannot have both a world master and a character acting as world master' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('fails without saving when the cast has no world master at all', async () => {
        const { useCase, adventureRepository } = buildCreate();

        const response = await useCase.execute({ ...REQUEST, worldMasterId: undefined });

        expect(response).toEqual({ success: false, error: 'An adventure without a world master needs a character acting as world master' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('fails without saving when the same character is the only playable and AI controlled', async () => {
        const { useCase, adventureRepository } = buildCreate();

        const response = await useCase.execute({ ...REQUEST, playableCharacterIds: ['npc'], aiControlledCharacterIds: ['npc'] });

        expect(response).toEqual({ success: false, error: 'You need at least 1 playable character' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('sends the adventure built by the service to the character selection validation', async () => {
        const validate = jest.fn().mockReturnValue({ success: false, error: 'Invalid selection' });
        const { useCase, adventureRepository } = buildCreate(undefined, undefined, { validate });

        const response = await useCase.execute(REQUEST);

        expect(validate).toHaveBeenCalledWith(expect.objectContaining({ characterIds: ['hero', 'npc'], charactersControlledByAi: ['npc'] }));
        expect(response).toEqual({ success: false, error: 'Invalid selection' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('returns the service error when the service fails', async () => {
        const { useCase, adventureRepository } = buildCreate(undefined, { createAdventure: jest.fn().mockReturnValue({ success: false, error: 'Service failed' }) });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Service failed' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('returns a fallback error when the service fails without one', async () => {
        const { useCase, adventureRepository } = buildCreate(undefined, { createAdventure: jest.fn().mockReturnValue({ success: false }) });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on CreateAdventureService' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('fails when the service succeeds without an adventure', async () => {
        const { useCase } = buildCreate(undefined, { createAdventure: jest.fn().mockReturnValue({ success: true }) });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'success is true but does not have an adventure object' });
    });

    it('does not save when getWorldMasterById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getWorldMasterById.mockResolvedValue({ success: true });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from World Masters' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getSystemPromptById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getSystemPromptById.mockResolvedValue({ success: true });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from System Prompts' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getWorldById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getWorldById.mockResolvedValue({ success: true });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from Worlds' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getLocationById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getLocationById.mockResolvedValue({ success: true });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from Locations' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getItemById does not find the referenced entity', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getItemById.mockResolvedValue({ success: true });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Entity not found for id: 1 from Items' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getWorldMasterById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getWorldMasterById.mockResolvedValue({ success: false, error: 'Failed to load world masters' });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Failed to load world masters' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getSystemPromptById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getSystemPromptById.mockResolvedValue({ success: false, error: 'Failed to load system prompts' });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Failed to load system prompts' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getWorldById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getWorldById.mockResolvedValue({ success: false, error: 'Failed to load worlds' });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Failed to load worlds' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getLocationById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getLocationById.mockResolvedValue({ success: false, error: 'Failed to load locations' });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Failed to load locations' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('does not save when getItemById cannot be loaded', async () => {
        const { useCase, found, adventureRepository } = buildCreate();
        found.getItemById.mockResolvedValue({ success: false, error: 'Failed to load items' });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Failed to load items' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventures cannot be loaded', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.getAdventureIndex.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('returns a fallback error when the adventure index has no entries', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.getAdventureIndex.mockResolvedValue({ success: true });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Failed to load adventures' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('fails when an adventure with the same name already exists', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.getAdventureIndex.mockResolvedValue({
            success: true,
            entries: [createAdventureHelper({ id: 'other', name: 'Another Adventure' }), createAdventureHelper({ id: 'old', name: REQUEST.name })]
        });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: `An adventure name ${REQUEST.name} already exists` });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('treats names that differ only by case as different names', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.getAdventureIndex.mockResolvedValue({
            success: true,
            entries: [createAdventureHelper({ id: 'old', name: REQUEST.name.toUpperCase() })]
        });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: true, id: 'adv-1' });
    });

    it('returns the repository error when saving fails', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.saveAdventure.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('returns a fallback error when saving fails without one', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.saveAdventure.mockResolvedValue({ success: false });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Failed to save adventure' });
    });

    it('compares the trimmed name against the existing adventures', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.getAdventureIndex.mockResolvedValue({
            success: true,
            entries: [createAdventureHelper({ id: 'old', name: REQUEST.name })]
        });

        const response = await useCase.execute({ ...REQUEST, name: `  ${REQUEST.name}  ` });

        expect(response).toEqual({ success: false, error: `An adventure name ${REQUEST.name} already exists` });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });
});
