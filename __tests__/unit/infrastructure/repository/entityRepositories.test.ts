import {
    AssistantRepository,
    CharacterRepository,
    ConnectionRepository,
    ItemRepository,
    LocationRepository,
    ProficiencyRepository,
    SamplerRepository,
    StatusRepository,
    SystemPromptRepository,
    WorldMasterRepository,
    WorldRepository,
} from '@infra/repository';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';
import {
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

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

type Entity = { id: string; };
type Response = { success: boolean; error?: string; } & Record<string, unknown>;
type Repository = Record<string, (arg?: unknown) => Promise<Response>>;
type RepositoryClass = new (logger: ILogger, storage: IStorage) => unknown;

const CASES = [
    { Repository: AssistantRepository, create: createAssistantHelper, name: 'Assistant', plural: 'Assistants', field: 'assistant', list: 'assistants', label: 'assistant', labels: 'assistants', idLabel: 'Assistant', namespace: 'assistant' },
    { Repository: CharacterRepository, create: createCharacterHelper, name: 'Character', plural: 'Characters', field: 'character', list: 'characters', label: 'character', labels: 'characters', idLabel: 'Character', namespace: 'character' },
    { Repository: ConnectionRepository, create: createConnectionHelper, name: 'Connection', plural: 'Connections', field: 'connection', list: 'connections', label: 'connection', labels: 'connections', idLabel: 'Connection', namespace: 'connection' },
    { Repository: ItemRepository, create: createItemHelper, name: 'Item', plural: 'Items', field: 'item', list: 'items', label: 'item', labels: 'items', idLabel: 'Item', namespace: 'item' },
    { Repository: LocationRepository, create: createLocationHelper, name: 'Location', plural: 'Locations', field: 'location', list: 'locations', label: 'location', labels: 'locations', idLabel: 'Location', namespace: 'location' },
    { Repository: ProficiencyRepository, create: createProficiencyHelper, name: 'Proficiency', plural: 'Proficiencies', field: 'proficiency', list: 'proficiencies', label: 'proficiency', labels: 'proficiencies', idLabel: 'Proficiency', namespace: 'proficiency' },
    { Repository: SamplerRepository, create: createSamplerHelper, name: 'Sampler', plural: 'Samplers', field: 'sampler', list: 'samplers', label: 'sampler', labels: 'samplers', idLabel: 'Sampler', namespace: 'sampler' },
    { Repository: StatusRepository, create: createStatusHelper, name: 'Status', plural: 'Statuses', field: 'status', list: 'statuses', label: 'status', labels: 'statuses', idLabel: 'Status', namespace: 'status' },
    { Repository: SystemPromptRepository, create: createSystemPromptHelper, name: 'SystemPrompt', plural: 'SystemPrompts', field: 'systemPrompt', list: 'systemPrompts', label: 'system prompt', labels: 'system prompts', idLabel: 'SystemPrompt', namespace: 'system_prompt' },
    { Repository: WorldRepository, create: createWorldHelper, name: 'World', plural: 'Worlds', field: 'world', list: 'worlds', label: 'world', labels: 'worlds', idLabel: 'World', namespace: 'world' },
    { Repository: WorldMasterRepository, create: createWorldMasterHelper, name: 'WorldMaster', plural: 'WorldMasters', field: 'worldMaster', list: 'worldMasters', label: 'world master', labels: 'world masters', idLabel: 'WorldMaster', namespace: 'world_master' },
] as const;

describe.each(CASES)('$Repository.name', ({ Repository, create, name, plural, field, list, label, labels, idLabel, namespace }) => {
    const KEY = `@my_dungeon_app/${namespace}`;
    const LOAD_FAILURE = { success: false, error: `Failed to load ${KEY}` };
    const SAVE_FAILURE = { success: false, error: `Failed to save ${KEY}` };

    const save = `save${name}`;
    const getById = `get${name}ById`;
    const getAll = `get${plural}`;
    const edit = `edit${name}`;
    const erase = `erase${name}`;

    function entity (id: string): Entity {
        return (create as (overrides: Partial<Entity>) => Entity)({ id });
    }

    function buildRepository (stored: unknown) {
        const storage = {
            load: jest.fn().mockResolvedValue({ success: true, data: stored }),
            save: jest.fn().mockResolvedValue({ success: true })
        };
        const repository = new (Repository as unknown as RepositoryClass)(mockLogger, storage as unknown as IStorage) as Repository;
        return { repository, storage };
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe(getAll, () => {
        it('returns the stored entities', async () => {
            const { repository, storage } = buildRepository([entity('e1')]);

            const result = await repository[getAll]();

            expect(storage.load).toHaveBeenCalledWith(KEY);
            expect(result.success).toBe(true);
            expect((result[list] as Entity[]).map(e => e.id)).toEqual(['e1']);
        });

        it('returns an empty list when nothing is stored', async () => {
            const { repository } = buildRepository(null);

            const result = await repository[getAll]();

            expect(result).toEqual({ success: true, [list]: [] });
        });

        it('skips stored entries that are not valid entities', async () => {
            const { repository } = buildRepository([entity('e1'), { id: 'broken' }]);

            const result = await repository[getAll]();

            expect((result[list] as Entity[]).map(e => e.id)).toEqual(['e1']);
            expect(mockLogger.warning).toHaveBeenCalledWith(`Some ${labels} were not converted to entity`);
        });

        it('fails when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository[getAll]();

            expect(result).toEqual({ success: false, error: `Failed to load ${labels}` });
        });

        it('fails when the stored value is not a list', async () => {
            const { repository } = buildRepository({ not: 'a list' });

            const result = await repository[getAll]();

            expect(result).toEqual({ success: false, error: `Failed to load ${labels}` });
        });
    });

    describe(getById, () => {
        it('returns the entity with the given id', async () => {
            const { repository } = buildRepository([entity('e1'), entity('e2')]);

            const result = await repository[getById]('e2');

            expect(result.success).toBe(true);
            expect((result[field] as Entity).id).toBe('e2');
        });

        it('succeeds without an entity when the id is unknown', async () => {
            const { repository } = buildRepository([entity('e1')]);

            const result = await repository[getById]('missing');

            expect(result).toEqual({ success: true, [field]: undefined });
        });

        it('propagates a storage failure', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository[getById]('e1');

            expect(result).toEqual({ success: false, error: `Failed to load ${labels}` });
        });
    });

    describe(save, () => {
        it('appends the entity to the stored list', async () => {
            const existing = entity('e1');
            const added = entity('e2');
            const { repository, storage } = buildRepository([existing]);

            const result = await repository[save]({ [field]: added });

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, [existing, added]);
        });

        it('starts the list when nothing is stored', async () => {
            const added = entity('e1');
            const { repository, storage } = buildRepository(null);

            await repository[save]({ [field]: added });

            expect(storage.save).toHaveBeenCalledWith(KEY, [added]);
        });

        it('fails without writing when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository[save]({ [field]: entity('e1') });

            expect(result).toEqual({ success: false, error: `Failed to save ${label}` });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository([]);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository[save]({ [field]: entity('e1') });

            expect(result).toEqual({ success: false, error: `Failed to save ${label}` });
        });
    });

    describe(edit, () => {
        it('replaces the stored entity', async () => {
            const kept = entity('e1');
            const edited = { ...entity('e2'), name: 'edited' };
            const { repository, storage } = buildRepository([kept, entity('e2')]);

            const result = await repository[edit]({ [field]: edited });

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, [kept, edited]);
        });

        it.each([
            ['the entity does not exist', [] as unknown[]],
            ['nothing is stored yet', null]
        ])('fails without writing when %s', async (_, stored) => {
            const { repository, storage } = buildRepository(stored);

            const result = await repository[edit]({ [field]: entity('e1') });

            expect(result).toEqual({ success: false, error: `${idLabel} with id e1 does not exist` });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails without writing when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository[edit]({ [field]: entity('e1') });

            expect(result).toEqual({ success: false, error: `Failed to edit ${label}` });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository([entity('e1')]);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository[edit]({ [field]: entity('e1') });

            expect(result).toEqual({ success: false, error: `Failed to edit ${label}` });
        });
    });

    describe(erase, () => {
        it('removes the entity from the stored list', async () => {
            const kept = entity('e1');
            const { repository, storage } = buildRepository([kept, entity('e2')]);

            const result = await repository[erase]('e2');

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, [kept]);
        });

        it.each([
            ['the entity does not exist', [] as unknown[]],
            ['nothing is stored yet', null]
        ])('fails without writing when %s', async (_, stored) => {
            const { repository, storage } = buildRepository(stored);

            const result = await repository[erase]('e1');

            expect(result).toEqual({ success: false, error: `${idLabel} with id e1 does not exist` });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails without writing when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository[erase]('e1');

            expect(result).toEqual({ success: false, error: `Failed to erase ${label}` });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository([entity('e1')]);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository[erase]('e1');

            expect(result).toEqual({ success: false, error: `Failed to erase ${label}` });
        });
    });
});
