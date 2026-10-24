import { CreateAdventureUseCase } from '@application/use-cases';
import { CreateAdventureService } from '@application/services';
import { ICreateAdventureService } from '@domain/services';
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
        getAdventures: jest.fn().mockResolvedValue({ success: true, adventures: [] }),
        getAdventureById: jest.fn().mockResolvedValue({ success: true, adventure: createAdventureHelper({ id: 'adv-1' }) }),
        saveAdventure: jest.fn().mockResolvedValue({ success: true }),
        updateAdventure: jest.fn().mockResolvedValue({ success: true }),
    };
    return { found, adventureRepository };
}

function buildCreate (missingCharacter?: string, service?: ICreateAdventureService) {
    const { found, adventureRepository } = buildRepositories(missingCharacter);
    const idGenerator = { generate: jest.fn().mockReturnValue('adv-1') };
    const useCase = new CreateAdventureUseCase(
        logger,
        service ?? new CreateAdventureService(logger, idGenerator),
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

    it('returns the service error when the cast breaks the character rules', async () => {
        const { useCase, adventureRepository } = buildCreate();

        const response = await useCase.execute({ ...REQUEST, playableCharacterIds: [] });

        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('fails when the service succeeds without an adventure', async () => {
        const { useCase } = buildCreate(undefined, { createAdventure: jest.fn().mockReturnValue({ success: true }) });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'success is true but does not have an adventure object' });
    });

    it.each([
        ['getWorldMasterById', 'WorldMaster'],
        ['getSystemPromptById', 'SystemPrompt'],
        ['getWorldById', 'World'],
        ['getLocationById', 'Location'],
        ['getItemById', 'Item']
    ] as const)('does not save when %s does not find the referenced entity', async (method, label) => {
        const { useCase, found, adventureRepository } = buildCreate();
        found[method].mockResolvedValue({ success: true });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: `${label} not found: 1` });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when the adventures cannot be loaded', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.getAdventures.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('fails when an adventure with the same name already exists', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.getAdventures.mockResolvedValue({
            success: true,
            adventures: [createAdventureHelper({ id: 'other', name: 'Another Adventure' }), createAdventureHelper({ id: 'old', name: REQUEST.name })]
        });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: `An adventure name ${REQUEST.name} already exists` });
        expect(adventureRepository.saveAdventure).not.toHaveBeenCalled();
    });

    it('returns the repository error when saving fails', async () => {
        const { useCase, adventureRepository } = buildCreate();
        adventureRepository.saveAdventure.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await useCase.execute(REQUEST);

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });
});
