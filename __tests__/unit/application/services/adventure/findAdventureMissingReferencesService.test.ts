import { FindAdventureMissingReferencesService } from '@application/services';
import { Adventure, Character, MissingReferenceKindEnum, MissingReferenceOwnerEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    createAdventureHelper,
    createAssistantHelper,
    createCharacterHelper,
    createSamplerHelper,
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

function buildService (missingIds: string[] = [], character: Partial<Character> = {}) {
    const found = (key: string, build: (id: string) => unknown = (id) => ({ id })) => jest.fn(async (id: string) => {
        const entity = missingIds.includes(id) ? undefined : build(id);
        return { success: true, [key]: entity };
    });

    const repositories = {
        getCharacterById: found('character', (id) => createCharacterHelper({
            id,
            name: 'Hero',
            assistantId: 'assistant',
            abilityIds: ['ability'],
            proficiencyIds: ['proficiency'],
            statusIds: ['status'],
            ...character,
        })),
        getWorldMasterById: found('worldMaster', (id) => createWorldMasterHelper({ id, name: 'Luna', assistantId: 'wm-assistant' })),
        getAssistantById: found('assistant', (id) => createAssistantHelper({ id, name: `${id} name`, samplerId: 'sampler', connectionId: 'connection' })),
        getConnectionById: found('connection'),
        getSamplerById: found('sampler'),
        getWorldById: found('world'),
        getLocationById: found('location'),
        getItemById: found('item'),
        getSystemPromptById: found('systemPrompt'),
        getAbilityById: found('ability'),
        getProficiencyById: found('proficiency'),
        getStatusById: found('status'),
    };
    const getSamplersService = { findSystemDefaultSampler: jest.fn() };
    const r = repositories as never;
    const service = new FindAdventureMissingReferencesService(logger, r, r, r, r, r, getSamplersService as never, r, r, r, r, r, r, r);
    return { service, repositories, getSamplersService };
}

function buildAdventure (overrides: Partial<Adventure> = {}): Adventure {
    return createAdventureHelper({
        name: 'Quest',
        characterIds: ['hero'],
        worldMasterId: 'wm',
        systemPromptIds: ['prompt'],
        worldIds: ['world'],
        locationIds: ['location'],
        itemIds: ['item'],
        ...overrides,
    });
}

describe('FindAdventureMissingReferencesService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('finds nothing when every reference exists', async () => {
        const { service } = buildService();

        const response = await service.find({ adventure: buildAdventure() });

        expect(response).toEqual({ success: true, missingReferences: [] });
    });

    it('reports a missing character on the adventure', async () => {
        const { service } = buildService(['hero']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.ADVENTURE, ownerName: 'Quest', kind: MissingReferenceKindEnum.CHARACTER, id: 'hero' },
        ]);
    });

    it('reports a missing world master on the adventure', async () => {
        const { service } = buildService(['wm']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.ADVENTURE, ownerName: 'Quest', kind: MissingReferenceKindEnum.WORLD_MASTER, id: 'wm' },
        ]);
    });

    it('reports a missing system prompt on the adventure', async () => {
        const { service } = buildService(['prompt']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.ADVENTURE, ownerName: 'Quest', kind: MissingReferenceKindEnum.SYSTEM_PROMPT, id: 'prompt' },
        ]);
    });

    it('reports a missing world on the adventure', async () => {
        const { service } = buildService(['world']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.ADVENTURE, ownerName: 'Quest', kind: MissingReferenceKindEnum.WORLD, id: 'world' },
        ]);
    });

    it('reports a missing location on the adventure', async () => {
        const { service } = buildService(['location']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.ADVENTURE, ownerName: 'Quest', kind: MissingReferenceKindEnum.LOCATION, id: 'location' },
        ]);
    });

    it('reports a missing item on the adventure', async () => {
        const { service } = buildService(['item']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.ADVENTURE, ownerName: 'Quest', kind: MissingReferenceKindEnum.ITEM, id: 'item' },
        ]);
    });

    it('reports a missing assistant on the character that uses it', async () => {
        const { service } = buildService(['assistant']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.CHARACTER, ownerName: 'Hero', kind: MissingReferenceKindEnum.ASSISTANT, id: 'assistant' },
        ]);
    });

    it('reports a missing ability on the character that uses it', async () => {
        const { service } = buildService(['ability']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.CHARACTER, ownerName: 'Hero', kind: MissingReferenceKindEnum.ABILITY, id: 'ability' },
        ]);
    });

    it('reports a missing proficiency on the character that uses it', async () => {
        const { service } = buildService(['proficiency']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.CHARACTER, ownerName: 'Hero', kind: MissingReferenceKindEnum.PROFICIENCY, id: 'proficiency' },
        ]);
    });

    it('reports a missing status on the character that uses it', async () => {
        const { service } = buildService(['status']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.CHARACTER, ownerName: 'Hero', kind: MissingReferenceKindEnum.STATUS, id: 'status' },
        ]);
    });

    it('accepts a character without abilities, proficiencies and statuses', async () => {
        const { service, repositories } = buildService([], { abilityIds: undefined, proficiencyIds: undefined, statusIds: undefined });

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([]);
        expect(repositories.getAbilityById).not.toHaveBeenCalled();
    });

    it('reports a missing assistant on the world master that uses it', async () => {
        const { service } = buildService(['wm-assistant']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.WORLD_MASTER, ownerName: 'Luna', kind: MissingReferenceKindEnum.ASSISTANT, id: 'wm-assistant' },
        ]);
    });

    it('reports a missing sampler once for each assistant that uses it', async () => {
        const { service } = buildService(['sampler']);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.ASSISTANT, ownerName: 'assistant name', kind: MissingReferenceKindEnum.SAMPLER, id: 'sampler' },
            { owner: MissingReferenceOwnerEnum.ASSISTANT, ownerName: 'wm-assistant name', kind: MissingReferenceKindEnum.SAMPLER, id: 'sampler' },
        ]);
    });

    it('reports a missing connection on the assistant that uses it', async () => {
        const { service } = buildService(['connection']);

        const response = await service.find({ adventure: buildAdventure({ worldMasterId: undefined }) });

        expect(response.missingReferences).toEqual([
            { owner: MissingReferenceOwnerEnum.ASSISTANT, ownerName: 'assistant name', kind: MissingReferenceKindEnum.CONNECTION, id: 'connection' },
        ]);
    });

    it('does not report a system default sampler, which is never stored', async () => {
        const { service, getSamplersService } = buildService(['sampler']);
        getSamplersService.findSystemDefaultSampler.mockReturnValue(createSamplerHelper({ id: 'sampler' }));

        const response = await service.find({ adventure: buildAdventure() });

        expect(response.missingReferences).toEqual([]);
    });

    it('collects every missing reference instead of stopping at the first one', async () => {
        const { service } = buildService(['item', 'ability', 'connection']);

        const response = await service.find({ adventure: buildAdventure({ worldMasterId: undefined }) });

        expect(response.missingReferences?.map((reference) => reference.kind)).toEqual([
            MissingReferenceKindEnum.ITEM,
            MissingReferenceKindEnum.ABILITY,
            MissingReferenceKindEnum.CONNECTION,
        ]);
    });

    it('propagates a failure to load the characters', async () => {
        const { service, repositories } = buildService();
        repositories.getCharacterById.mockResolvedValue({ success: false, error: 'corrupted characters' } as never);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response).toEqual({ success: false, error: 'corrupted characters' });
    });

    it('propagates a failure to load the world master', async () => {
        const { service, repositories } = buildService();
        repositories.getWorldMasterById.mockResolvedValue({ success: false, error: 'corrupted world masters' } as never);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response).toEqual({ success: false, error: 'corrupted world masters' });
    });

    it('propagates a failure to load the assistants', async () => {
        const { service, repositories } = buildService();
        repositories.getAssistantById.mockResolvedValue({ success: false, error: 'corrupted assistants' } as never);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response).toEqual({ success: false, error: 'corrupted assistants' });
    });

    it('propagates a failure to check a reference', async () => {
        const { service, repositories } = buildService();
        repositories.getItemById.mockResolvedValue({ success: false, error: 'corrupted items' } as never);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response).toEqual({ success: false, error: 'corrupted items' });
    });

    it('fails with a generic error when a reference check fails without a message', async () => {
        const { service, repositories } = buildService();
        repositories.getItemById.mockResolvedValue({ success: false } as never);

        const response = await service.find({ adventure: buildAdventure() });

        expect(response).toEqual({ success: false, error: 'Failed to resolve item' });
    });
});
