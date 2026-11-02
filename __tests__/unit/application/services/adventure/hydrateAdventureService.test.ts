import { HydrateAdventureService } from '@application/services';
import { ILogger } from '@domain/logger';
import {
    createAbilityHelper,
    createAdventureHelper,
    createAssistantHelper,
    createCharacterHelper,
    createChatHelper,
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
    return { service, repositories, getSamplersService };
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

        expect(response).toEqual({ success: false, error: 'Entity not found for id: gone from Characters' });
    });

    it('names the world master collection when the world master does not exist', async () => {
        const { service } = buildService();

        const response = await service.hydrate({ adventure: createAdventureHelper({ worldMasterId: 'gone' }) });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: gone from World Masters' });
    });

    it('names the system prompt collection when a system prompt does not exist', async () => {
        const { service, repositories } = buildService();
        repositories.getSystemPromptById.mockResolvedValue({ success: true, systemPrompt: undefined } as never);

        const response = await service.hydrate({ adventure: createAdventureHelper({ systemPromptIds: ['gone'] }) });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: gone from System Prompts' });
    });

    it('names the ability collection when an ability of a character does not exist', async () => {
        const { service, repositories } = buildService();
        repositories.getCharacterById.mockResolvedValue({ success: true, character: createCharacterHelper({ assistantId: 'assistant-1', abilityIds: ['gone'] }) });
        repositories.getAbilityById.mockResolvedValue({ success: true, ability: undefined } as never);

        const response = await service.hydrate({ adventure: createAdventureHelper({ characterIds: ['hero'] }) });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: gone from Abilities' });
    });

    it('fails when an assistant does not exist', async () => {
        const { service, repositories } = buildService();
        repositories.getAssistantById.mockResolvedValueOnce({ success: true, assistant: undefined } as never);

        const response = await service.hydrate({ adventure: createAdventureHelper({ characterIds: ['hero'] }) });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: assistant-1 from Assistants' });
    });

    it('propagates a repository failure without resolving the next references', async () => {
        const { service, repositories } = buildService();
        repositories.getCharacterById.mockResolvedValueOnce({ success: false, error: 'Failed to load characters' } as never);

        const response = await service.hydrate({ adventure: createAdventureHelper({ characterIds: ['hero'] }) });

        expect(response).toEqual({ success: false, error: 'Failed to load characters' });
        expect(repositories.getAssistantById).not.toHaveBeenCalled();
        expect(logger.warning).toHaveBeenCalled();
    });

    it('lets an exception thrown by a repository reach the caller', async () => {
        const { service, repositories } = buildService();
        (repositories.getCharacterById as jest.Mock).mockRejectedValue(new Error('Storage offline'));

        await expect(service.hydrate({ adventure: createAdventureHelper({ characterIds: ['hero'] }) })).rejects.toThrow('Storage offline');
    });

    it('returns only success and the hydrated adventure with every field', async () => {
        const { service, repositories } = buildService();
        const hero = createCharacterHelper({ id: 'hero', assistantId: 'assistant-1', abilityIds: ['ability-1'], proficiencyIds: ['proficiency-1'], statusIds: ['status-1'] });
        const worldMaster = createWorldMasterHelper({ id: 'wm-1', assistantId: 'assistant-1' });
        const assistant = createAssistantHelper({ id: 'assistant-1', samplerId: 'sampler-1', connectionId: 'connection-1' });
        const sampler = createSamplerHelper({ id: 'sampler-1' });
        const connection = createConnectionHelper({ id: 'connection-1' });
        const world = createWorldHelper({ id: 'world-1' });
        const location = createLocationHelper({ id: 'location-1' });
        const item = createItemHelper({ id: 'item-1' });
        const systemPrompt = createSystemPromptHelper({ id: 'prompt-1' });
        const ability = createAbilityHelper({ id: 'ability-1' });
        const proficiency = createProficiencyHelper({ id: 'proficiency-1' });
        const status = createStatusHelper({ id: 'status-1' });
        repositories.getCharacterById.mockResolvedValue({ success: true, character: hero });
        repositories.getWorldMasterById.mockResolvedValue({ success: true, worldMaster });
        repositories.getAssistantById.mockResolvedValue({ success: true, assistant });
        repositories.getSamplerById.mockResolvedValue({ success: true, sampler });
        repositories.getConnectionById.mockResolvedValue({ success: true, connection });
        repositories.getWorldById.mockResolvedValue({ success: true, world });
        repositories.getLocationById.mockResolvedValue({ success: true, location });
        repositories.getItemById.mockResolvedValue({ success: true, item });
        repositories.getSystemPromptById.mockResolvedValue({ success: true, systemPrompt });
        repositories.getAbilityById.mockResolvedValue({ success: true, ability });
        repositories.getProficiencyById.mockResolvedValue({ success: true, proficiency });
        repositories.getStatusById.mockResolvedValue({ success: true, status });
        const adventure = createAdventureHelper({
            chat: [createChatHelper()],
            characterIds: ['hero'],
            worldMasterId: 'wm-1',
            worldIds: ['world-1'],
            locationIds: ['location-1'],
            itemIds: ['item-1'],
            systemPromptIds: ['prompt-1'],
        });

        const response = await service.hydrate({ adventure });

        expect(response).toStrictEqual({
            success: true,
            hydrated: {
                adventure,
                characters: [{ ...hero, abilities: [ability], proficiencies: [proficiency], statuses: [status], worldMaster: false, aiControlled: false }],
                worldMaster,
                assistants: { 'assistant-1': assistant },
                samplers: [sampler],
                connections: [connection],
                worlds: [world],
                locations: [location],
                items: [item],
                systemPrompts: [systemPrompt],
                abilities: [ability],
                proficiencies: [proficiency],
                statuses: [status],
            },
        });
    });

    it('returns empty references for an adventure that has none', async () => {
        const { service, repositories } = buildService();

        const response = await service.hydrate({ adventure: createAdventureHelper() });

        expect(response.success).toBe(true);
        expect(response.hydrated).toEqual(expect.objectContaining({
            characters: [],
            worldMaster: undefined,
            assistants: {},
            samplers: [],
            connections: [],
            worlds: [],
            locations: [],
            items: [],
            systemPrompts: [],
            abilities: [],
            proficiencies: [],
            statuses: [],
        }));
        expect(repositories.getAssistantById).not.toHaveBeenCalled();
    });

    it('does not look for a world master when the adventure has none', async () => {
        const { service, repositories } = buildService();

        const response = await service.hydrate({ adventure: createAdventureHelper({ characterIds: ['hero'] }) });

        expect(response.hydrated?.worldMaster).toBeUndefined();
        expect(repositories.getWorldMasterById).not.toHaveBeenCalled();
    });

    it('treats a blank worldMasterId as no world master', async () => {
        const { service, repositories } = buildService();

        const response = await service.hydrate({ adventure: createAdventureHelper({ characterIds: ['hero'], worldMasterId: '' }) });

        expect(response.success).toBe(true);
        expect(response.hydrated?.worldMaster).toBeUndefined();
        expect(repositories.getWorldMasterById).not.toHaveBeenCalled();
    });

    it('resolves the assistant of a world master in an adventure without characters', async () => {
        const { service, repositories } = buildService();
        repositories.getWorldMasterById.mockResolvedValue({ success: true, worldMaster: createWorldMasterHelper({ id: 'wm-1', assistantId: 'assistant-wm' }) });

        const response = await service.hydrate({ adventure: createAdventureHelper({ worldMasterId: 'wm-1' }) });

        expect(Object.keys(response.hydrated?.assistants ?? {})).toEqual(['assistant-wm']);
    });

    it('prefers a stored sampler over a system default with the same id', async () => {
        const { service, repositories, getSamplersService } = buildService();
        const storedSampler = createSamplerHelper({ id: 'sampler-1' });
        repositories.getSamplerById.mockResolvedValue({ success: true, sampler: storedSampler });
        getSamplersService.findSystemDefaultSampler.mockReturnValue(createSamplerHelper({ id: 'sampler-1', systemDefault: true }));

        const response = await service.hydrate({ adventure: createAdventureHelper({ characterIds: ['hero'] }) });

        expect(response.hydrated?.samplers).toEqual([storedSampler]);
        expect(getSamplersService.findSystemDefaultSampler).not.toHaveBeenCalled();
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
                worldMaster: false,
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

        it('flags only the character acting as world master', async () => {
            const { service } = buildFullService();

            const response = await service.hydrate({ adventure: { ...adventure, worldMasterId: undefined, characterAsWorldMasterId: 'hero' } });

            expect(response.hydrated?.worldMaster).toBeUndefined();
            expect(response.hydrated?.characters.map(c => c.worldMaster)).toEqual([true, false]);
        });

        it('keeps the order of the ids of the adventure', async () => {
            const { service } = buildFullService();

            const response = await service.hydrate({
                adventure: {
                    ...adventure,
                    worldIds: ['world-2', 'world-1'],
                    locationIds: ['location-2', 'location-1'],
                    itemIds: ['item-2', 'item-1'],
                    systemPromptIds: ['prompt-2', 'prompt-1'],
                },
            });

            expect(response.hydrated?.worlds.map(w => w.id)).toEqual(['world-2', 'world-1']);
            expect(response.hydrated?.locations.map(l => l.id)).toEqual(['location-2', 'location-1']);
            expect(response.hydrated?.items.map(i => i.id)).toEqual(['item-2', 'item-1']);
            expect(response.hydrated?.systemPrompts.map(p => p.id)).toEqual(['prompt-2', 'prompt-1']);
        });

        it('stops at the first id that does not resolve', async () => {
            const { service, repositories } = buildFullService();
            repositories.getWorldById.mockImplementation(async (id: string) => ({ success: true, world: id === 'gone' ? undefined : createWorldHelper({ id }) }));

            const response = await service.hydrate({ adventure: { ...adventure, worldIds: ['world-1', 'gone', 'world-3'] } });

            expect(response).toEqual({ success: false, error: 'Entity not found for id: gone from Worlds' });
            expect(repositories.getWorldById).toHaveBeenCalledTimes(2);
        });

        it('gives each character only its own traits', async () => {
            const { service, repositories } = buildFullService();
            repositories.getCharacterById.mockImplementation(async (id: string) => ({
                success: true,
                character: createCharacterHelper({ id, assistantId: 'assistant-1', abilityIds: [`${id}-ability`], proficiencyIds: [`${id}-proficiency`], statusIds: [`${id}-status`] })
            }));

            const response = await service.hydrate({ adventure });

            const [hero, sidekick] = response.hydrated?.characters ?? [];
            expect(hero.abilities.map(a => a.id)).toEqual(['hero-ability']);
            expect(sidekick.abilities.map(a => a.id)).toEqual(['sidekick-ability']);
            expect(hero.proficiencies.map(p => p.id)).toEqual(['hero-proficiency']);
            expect(sidekick.proficiencies.map(p => p.id)).toEqual(['sidekick-proficiency']);
            expect(hero.statuses.map(s => s.id)).toEqual(['hero-status']);
            expect(sidekick.statuses.map(s => s.id)).toEqual(['sidekick-status']);
        });

        it('looks up once an assistant shared by two characters', async () => {
            const { service, repositories } = buildFullService();

            await service.hydrate({ adventure: { ...adventure, worldMasterId: undefined } });

            expect(repositories.getAssistantById).toHaveBeenCalledTimes(1);
        });

        it('looks up once an assistant shared by a character and the world master', async () => {
            const { service, repositories } = buildFullService();
            repositories.getWorldMasterById.mockResolvedValue({ success: true, worldMaster: createWorldMasterHelper({ id: 'wm-1', assistantId: 'assistant-1' }) });

            await service.hydrate({ adventure });

            expect(repositories.getAssistantById).toHaveBeenCalledTimes(1);
        });

        it('resolves once a sampler shared by two assistants', async () => {
            const { service, repositories } = buildFullService();

            const response = await service.hydrate({ adventure });

            expect(response.hydrated?.samplers.map(s => s.id)).toEqual(['sampler-1']);
            expect(repositories.getSamplerById).toHaveBeenCalledTimes(1);
        });

        it('resolves once a connection shared by two assistants', async () => {
            const { service, repositories } = buildFullService();

            const response = await service.hydrate({ adventure });

            expect(response.hydrated?.connections.map(c => c.id)).toEqual(['connection-1']);
            expect(repositories.getConnectionById).toHaveBeenCalledTimes(1);
        });

        it('resolves once an ability shared by two characters and gives it to both', async () => {
            const { service, repositories } = buildFullService();

            const response = await service.hydrate({ adventure: { ...adventure, characterIds: ['hero', 'ally'] } });

            expect(response.hydrated?.abilities.map(a => a.id)).toEqual(['ability-1']);
            expect(response.hydrated?.characters.map(c => c.abilities.map(a => a.id))).toEqual([['ability-1'], ['ability-1']]);
            expect(repositories.getAbilityById).toHaveBeenCalledTimes(1);
        });

        it('resolves once a proficiency shared by two characters and gives it to both', async () => {
            const { service, repositories } = buildFullService();

            const response = await service.hydrate({ adventure: { ...adventure, characterIds: ['hero', 'ally'] } });

            expect(response.hydrated?.proficiencies.map(p => p.id)).toEqual(['proficiency-1']);
            expect(response.hydrated?.characters.map(c => c.proficiencies.map(p => p.id))).toEqual([['proficiency-1'], ['proficiency-1']]);
            expect(repositories.getProficiencyById).toHaveBeenCalledTimes(1);
        });

        it('resolves once a status shared by two characters and gives it to both', async () => {
            const { service, repositories } = buildFullService();

            const response = await service.hydrate({ adventure: { ...adventure, characterIds: ['hero', 'ally'] } });

            expect(response.hydrated?.statuses.map(s => s.id)).toEqual(['status-1']);
            expect(response.hydrated?.characters.map(c => c.statuses.map(s => s.id))).toEqual([['status-1'], ['status-1']]);
            expect(repositories.getStatusById).toHaveBeenCalledTimes(1);
        });

        it('names the sampler collection when the sampler is neither stored nor a system default', async () => {
            const { service, repositories } = buildFullService();
            repositories.getSamplerById.mockResolvedValue({ success: true, sampler: undefined } as never);

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Entity not found for id: sampler-1 from Samplers' });
        });

        it('names the connection collection when a connection does not exist', async () => {
            const { service, repositories } = buildFullService();
            repositories.getConnectionById.mockResolvedValue({ success: true, connection: undefined } as never);

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Entity not found for id: connection-1 from Connections' });
        });

        it('names the world collection when a world does not exist', async () => {
            const { service, repositories } = buildFullService();
            repositories.getWorldById.mockResolvedValue({ success: true, world: undefined } as never);

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Entity not found for id: world-1 from Worlds' });
        });

        it('names the location collection when a location does not exist', async () => {
            const { service, repositories } = buildFullService();
            repositories.getLocationById.mockResolvedValue({ success: true, location: undefined } as never);

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Entity not found for id: location-1 from Locations' });
        });

        it('names the item collection when an item does not exist', async () => {
            const { service, repositories } = buildFullService();
            repositories.getItemById.mockResolvedValue({ success: true, item: undefined } as never);

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Entity not found for id: item-1 from Items' });
        });

        it('names the proficiency collection when a proficiency of a character does not exist', async () => {
            const { service, repositories } = buildFullService();
            repositories.getProficiencyById.mockResolvedValue({ success: true, proficiency: undefined } as never);

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Entity not found for id: proficiency-1 from Proficiencies' });
        });

        it('names the status collection when a status of a character does not exist', async () => {
            const { service, repositories } = buildFullService();
            repositories.getStatusById.mockResolvedValue({ success: true, status: undefined } as never);

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Entity not found for id: status-1 from Statuses' });
        });

        it('returns the message of getWorldMasterById without resolving the assistants', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getWorldMasterById as jest.Mock).mockResolvedValue({ success: false, error: 'World masters offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'World masters offline' });
            expect(repositories.getAssistantById).not.toHaveBeenCalled();
        });

        it('returns the message of getAssistantById without resolving the samplers', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getAssistantById as jest.Mock).mockResolvedValue({ success: false, error: 'Assistants offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Assistants offline' });
            expect(repositories.getSamplerById).not.toHaveBeenCalled();
        });

        it('returns the message of getSamplerById without resolving the connections', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getSamplerById as jest.Mock).mockResolvedValue({ success: false, error: 'Samplers offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Samplers offline' });
            expect(repositories.getConnectionById).not.toHaveBeenCalled();
        });

        it('returns the message of getConnectionById without resolving the worlds', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getConnectionById as jest.Mock).mockResolvedValue({ success: false, error: 'Connections offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Connections offline' });
            expect(repositories.getWorldById).not.toHaveBeenCalled();
        });

        it('returns the message of getWorldById without resolving the locations', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getWorldById as jest.Mock).mockResolvedValue({ success: false, error: 'Worlds offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Worlds offline' });
            expect(repositories.getLocationById).not.toHaveBeenCalled();
        });

        it('returns the message of getLocationById without resolving the items', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getLocationById as jest.Mock).mockResolvedValue({ success: false, error: 'Locations offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Locations offline' });
            expect(repositories.getItemById).not.toHaveBeenCalled();
        });

        it('returns the message of getItemById without resolving the system prompts', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getItemById as jest.Mock).mockResolvedValue({ success: false, error: 'Items offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Items offline' });
            expect(repositories.getSystemPromptById).not.toHaveBeenCalled();
        });

        it('returns the message of getSystemPromptById without resolving the abilities', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getSystemPromptById as jest.Mock).mockResolvedValue({ success: false, error: 'System prompts offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'System prompts offline' });
            expect(repositories.getAbilityById).not.toHaveBeenCalled();
        });

        it('returns the message of getAbilityById without resolving the proficiencies', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getAbilityById as jest.Mock).mockResolvedValue({ success: false, error: 'Abilities offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Abilities offline' });
            expect(repositories.getProficiencyById).not.toHaveBeenCalled();
        });

        it('returns the message of getProficiencyById without resolving the statuses', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getProficiencyById as jest.Mock).mockResolvedValue({ success: false, error: 'Proficiencies offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Proficiencies offline' });
            expect(repositories.getStatusById).not.toHaveBeenCalled();
        });

        it('returns the message of getStatusById', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getStatusById as jest.Mock).mockResolvedValue({ success: false, error: 'Statuses offline' });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Statuses offline' });
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

        it('fails with a generic error when getWorldMasterById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getWorldMasterById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve world master' });
        });

        it('fails with a generic error when getAssistantById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getAssistantById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve assistants' });
        });

        it('fails with a generic error when getSamplerById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getSamplerById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve samplers' });
        });

        it('fails with a generic error when getConnectionById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getConnectionById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve connections' });
        });

        it('fails with a generic error when getWorldById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getWorldById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve worlds' });
        });

        it('fails with a generic error when getLocationById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getLocationById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve locations' });
        });

        it('fails with a generic error when getItemById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getItemById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve items' });
        });

        it('fails with a generic error when getSystemPromptById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getSystemPromptById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve system prompts' });
        });

        it('fails with a generic error when getAbilityById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getAbilityById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve abilities' });
        });

        it('fails with a generic error when getProficiencyById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getProficiencyById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve proficiencies' });
        });

        it('fails with a generic error when getStatusById fails without a message', async () => {
            const { service, repositories } = buildFullService();
            (repositories.getStatusById as jest.Mock).mockResolvedValue({ success: false });

            const response = await service.hydrate({ adventure });

            expect(response).toEqual({ success: false, error: 'Failed to resolve statuses' });
        });
    });
});
