import { HydrateAdventureService } from '@application/services';
import { ILogger } from '@domain/logger';
import {
    createAbilityHelper,
    createAdventureHelper,
    createAssistantHelper,
    createCharacterHelper,
    createConnectionHelper,
    createItemHelper,
    createLocationHelper,
    createProficiencyHelper,
    createSamplerHelper,
    createStatusHelper,
    createSystemPromptHelper,
    createWorldHelper,
    createWorldMasterHelper,
} from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

function buildService () {
    const repositories = {
        getCharacterById: jest.fn(async (id: string) => ({ success: true, character: createCharacterHelper({ id, assistantId: 'assistant-1' }) })),
        getWorldMasterById: jest.fn().mockResolvedValue({ success: true }),
        getAssistantById: jest.fn(async (id: string) => ({ success: true, assistant: createAssistantHelper({ id, samplerId: 'sampler-1', connectionId: 'connection-1' }) })),
        getConnectionById: jest.fn(async (id: string) => ({ success: true, connection: createConnectionHelper({ id }) })),
        getSamplerById: jest.fn(async (id: string) => ({ success: true, sampler: createSamplerHelper({ id }) })),
        getWorldById: jest.fn(),
        getLocationById: jest.fn(),
        getItemById: jest.fn(),
        getSystemPromptById: jest.fn(),
        getAbilityById: jest.fn(),
        getProficiencyById: jest.fn(),
        getStatusById: jest.fn(),
    };
    const getSamplersService = { findSystemDefaultSampler: jest.fn() };
    const r = repositories as never;
    const service = new HydrateAdventureService(logger, r, r, r, r, r, getSamplersService as never, r, r, r, r, r, r, r);
    return { service, repositories };
}

describe('HydrateAdventureService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('resolves every reference of the adventure', async () => {
        const { service } = buildService();
        const adventure = createAdventureHelper({ characterIds: ['hero'] });

        const response = await service.hydrate({ adventure });

        expect(response.success).toBe(true);
        expect(response.hydrated?.characters.map(c => c.id)).toEqual(['hero']);
        expect(Object.keys(response.hydrated?.assistants ?? {})).toEqual(['assistant-1']);
        expect(response.hydrated?.samplers.map(s => s.id)).toEqual(['sampler-1']);
        expect(response.hydrated?.connections.map(c => c.id)).toEqual(['connection-1']);
    });

    it('fails when a referenced character does not exist', async () => {
        const { service, repositories } = buildService();
        repositories.getCharacterById.mockResolvedValueOnce({ success: true, character: undefined } as never);

        const response = await service.hydrate({ adventure: createAdventureHelper({ characterIds: ['gone'] }) });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: gone' });
    });

    it('fails when an assistant does not exist', async () => {
        const { service, repositories } = buildService();
        repositories.getAssistantById.mockResolvedValueOnce({ success: true, assistant: undefined } as never);

        const response = await service.hydrate({ adventure: createAdventureHelper({ characterIds: ['hero'] }) });

        expect(response).toEqual({ success: false, error: 'Assistant not found: assistant-1' });
    });

    it('propagates a repository failure without resolving the next references', async () => {
        const { service, repositories } = buildService();
        repositories.getCharacterById.mockResolvedValueOnce({ success: false, error: 'Failed to load characters' } as never);

        const response = await service.hydrate({ adventure: createAdventureHelper({ characterIds: ['hero'] }) });

        expect(response).toEqual({ success: false, error: 'Failed to load characters' });
        expect(repositories.getAssistantById).not.toHaveBeenCalled();
        expect(logger.warning).toHaveBeenCalled();
    });

    describe('with every kind of reference', () => {
        function buildFullService () {
            const built = buildService();
            const { repositories } = built;
            repositories.getCharacterById.mockImplementation(async (id: string) => ({
                success: true,
                character: id === 'sidekick'
                    ? createCharacterHelper({ id, assistantId: 'assistant-1', abilityIds: undefined, proficiencyIds: undefined, statusIds: undefined })
                    : createCharacterHelper({ id, assistantId: 'assistant-1', abilityIds: ['ability-1'], proficiencyIds: ['proficiency-1'], statusIds: ['status-1'] })
            }));
            repositories.getWorldMasterById.mockResolvedValue({ success: true, worldMaster: createWorldMasterHelper({ id: 'wm-1', assistantId: 'assistant-wm' }) });
            repositories.getWorldById.mockImplementation(async (id: string) => ({ success: true, world: createWorldHelper({ id }) }));
            repositories.getLocationById.mockImplementation(async (id: string) => ({ success: true, location: createLocationHelper({ id }) }));
            repositories.getItemById.mockImplementation(async (id: string) => ({ success: true, item: createItemHelper({ id }) }));
            repositories.getSystemPromptById.mockImplementation(async (id: string) => ({ success: true, systemPrompt: createSystemPromptHelper({ id }) }));
            repositories.getAbilityById.mockImplementation(async (id: string) => ({ success: true, ability: createAbilityHelper({ id }) }));
            repositories.getProficiencyById.mockImplementation(async (id: string) => ({ success: true, proficiency: createProficiencyHelper({ id }) }));
            repositories.getStatusById.mockImplementation(async (id: string) => ({ success: true, status: createStatusHelper({ id }) }));
            return built;
        }

        const adventure = createAdventureHelper({
            characterIds: ['hero', 'sidekick'],
            worldMasterId: 'wm-1',
            characterAsWorldMasterId: 'hero',
            charactersControlledByAi: ['sidekick'],
            worldIds: ['world-1'],
            locationIds: ['location-1'],
            itemIds: ['item-1'],
            systemPromptIds: ['prompt-1']
        });

        it('resolves the world master, the adventure references and the character traits', async () => {
            const { service } = buildFullService();

            const response = await service.hydrate({ adventure });

            expect(response.success).toBe(true);
            const hydrated = response.hydrated!;
            expect(hydrated.worldMaster?.id).toBe('wm-1');
            expect(Object.keys(hydrated.assistants).sort()).toEqual(['assistant-1', 'assistant-wm']);
            expect(hydrated.worlds.map(w => w.id)).toEqual(['world-1']);
            expect(hydrated.locations.map(l => l.id)).toEqual(['location-1']);
            expect(hydrated.items.map(i => i.id)).toEqual(['item-1']);
            expect(hydrated.systemPrompts.map(p => p.id)).toEqual(['prompt-1']);
            const [hero, sidekick] = hydrated.characters;
            expect(hero).toEqual(expect.objectContaining({
                id: 'hero',
                worldMaster: true,
                aiControlled: false,
                abilities: [expect.objectContaining({ id: 'ability-1' })],
                proficiencies: [expect.objectContaining({ id: 'proficiency-1' })],
                statuses: [expect.objectContaining({ id: 'status-1' })]
            }));
            expect(sidekick).toEqual(expect.objectContaining({
                id: 'sidekick',
                worldMaster: false,
                aiControlled: true,
                abilities: [],
                proficiencies: [],
                statuses: []
            }));
        });

        it('falls back to the system default sampler when the sampler is not stored', async () => {
            const { repositories } = buildFullService();
            const systemDefault = createSamplerHelper({ id: 'sampler-1', systemDefault: true });
            repositories.getSamplerById.mockResolvedValue({ success: true, sampler: undefined } as never);
            const getSamplersService = { findSystemDefaultSampler: jest.fn().mockReturnValue(systemDefault) };
            const r = repositories as never;
            const withDefaults = new HydrateAdventureService(logger, r, r, r, r, r, getSamplersService as never, r, r, r, r, r, r, r);

            const response = await withDefaults.hydrate({ adventure });

            expect(response.hydrated?.samplers).toEqual([systemDefault]);
            expect(getSamplersService.findSystemDefaultSampler).toHaveBeenCalledWith('sampler-1');
        });

        it.each([
            ['getWorldMasterById', 'world master'],
            ['getAssistantById', 'assistants'],
            ['getSamplerById', 'samplers'],
            ['getConnectionById', 'connections'],
            ['getWorldById', 'worlds'],
            ['getLocationById', 'locations'],
            ['getItemById', 'items'],
            ['getSystemPromptById', 'system prompts'],
            ['getAbilityById', 'abilities'],
            ['getProficiencyById', 'proficiencies'],
            ['getStatusById', 'statuses']
        ] as const)('fails with a generic error when %s fails without a message', async (method, resource) => {
            const { service, repositories } = buildFullService();
            (repositories[method] as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: `Failed to resolve ${resource}` });
        });
    });
});
