import { ValidateUniqueIdsService } from '@application/services';
import { HydrateAdventureUseCase } from '@application/use-cases';
import { IHydrateAdventureService, HydratedCharacter } from '@domain/services';
import { IAdventureRepository } from '@domain/repository';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createCharacterHelper, createHydratedAdventureHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockHydrateAdventureService = {
    hydrate: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn()
};

const adventure = createAdventureHelper();

function buildUseCase (): HydrateAdventureUseCase {
    return new HydrateAdventureUseCase(
        mockLogger,
        mockAdventureRepository as unknown as IAdventureRepository,
        mockHydrateAdventureService as unknown as IHydrateAdventureService,
        new ValidateUniqueIdsService(mockLogger)
    );
}

function createHydratedCharacter (overrides?: Partial<HydratedCharacter>): HydratedCharacter {
    return {
        ...createCharacterHelper(),
        abilities: [],
        proficiencies: [],
        statuses: [],
        worldMaster: false,
        aiControlled: false,
        ...overrides
    };
}

describe('HydrateAdventureUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure });
    });

    it('should hydrate the adventure loaded by id', async () => {
        const hydrated = createHydratedAdventureHelper({ adventure });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true, hydrated });
        expect(mockAdventureRepository.getAdventureById).toHaveBeenCalledWith('adventure-1');
        expect(mockHydrateAdventureService.hydrate).toHaveBeenCalledWith({ adventure });
    });

    it('should fail when the adventure id is blank', async () => {
        const response = await buildUseCase().execute({ adventureId: '  ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(mockAdventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('should return the repository error when loading fails', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should return a fallback error when loading fails without an error', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Failed to load adventure' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail when the repository does not find the adventure', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Adventure with id adventure-1 not found' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail without hydrating when the stored adventure repeats a character id', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({ characterIds: ['hero', 'hero'] }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: hero from Characters' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail without hydrating when the stored adventure repeats an AI controlled character id', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({ charactersControlledByAi: ['npc', 'npc'] }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: npc from Characters' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail without hydrating when the stored adventure repeats a system prompt id', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({ systemPromptIds: ['prompt', 'prompt'] }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: prompt from System Prompts' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail without hydrating when the stored adventure repeats a world id', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({ worldIds: ['world', 'world'] }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: world from Worlds' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail without hydrating when the stored adventure repeats a location id', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({ locationIds: ['location', 'location'] }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: location from Locations' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail without hydrating when the stored adventure repeats an item id', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({ itemIds: ['item', 'item'] }) });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: item from Items' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should accept a character listed in the cast and as AI controlled', async () => {
        const hydrated = createHydratedAdventureHelper({ adventure });
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper({ characterIds: ['npc'], charactersControlledByAi: ['npc'] }) });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response.success).toBe(true);
    });

    it('should fail when a character repeats an ability id', async () => {
        const hydrated = createHydratedAdventureHelper({ characters: [createHydratedCharacter({ abilityIds: ['ability-1', 'ability-1'] })] });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: ability-1 from Abilities' });
    });

    it('should fail when a character repeats a proficiency id', async () => {
        const hydrated = createHydratedAdventureHelper({ characters: [createHydratedCharacter({ proficiencyIds: ['proficiency-1', 'proficiency-1'] })] });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: proficiency-1 from Proficiencies' });
    });

    it('should fail when a character repeats a status id', async () => {
        const hydrated = createHydratedAdventureHelper({ characters: [createHydratedCharacter({ statusIds: ['status-1', 'status-1'] })] });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: status-1 from Statuses' });
    });

    it('should find a repeated trait id in any character of the adventure', async () => {
        const hydrated = createHydratedAdventureHelper({
            characters: [
                createHydratedCharacter({ id: 'hero', abilityIds: ['ability-1'] }),
                createHydratedCharacter({ id: 'ally', abilityIds: ['ability-2', 'ability-2'] }),
            ],
        });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Repeated id: ability-2 from Abilities' });
    });

    it('should accept the same trait in two characters', async () => {
        const hydrated = createHydratedAdventureHelper({
            characters: [
                createHydratedCharacter({ id: 'hero', abilityIds: ['ability-1'] }),
                createHydratedCharacter({ id: 'ally', abilityIds: ['ability-1'] }),
            ],
        });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true, hydrated });
    });

    it('should accept characters without traits', async () => {
        const hydrated = createHydratedAdventureHelper({
            characters: [createHydratedCharacter({ abilityIds: undefined, proficiencyIds: undefined, statusIds: undefined })],
        });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true, hydrated });
    });

    it('should return the service error when hydration fails', async () => {
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: false, error: 'Some characters were not found' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Some characters were not found' });
        expect(mockLogger.warning).toHaveBeenCalled();
    });

    it('should fail with a generic error when hydration fails without an error', async () => {
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Failed to hydrate adventure' });
    });

    it('should fail when the service succeeds without a hydrated adventure', async () => {
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a hydrated adventure' });
    });

    it('should let an exception thrown by the service reach the caller', async () => {
        mockHydrateAdventureService.hydrate.mockRejectedValue(new Error('Storage offline'));

        await expect(buildUseCase().execute({ adventureId: 'adventure-1' })).rejects.toThrow('Storage offline');
    });
});
