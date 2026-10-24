import { AdventureRepository } from '@infra/repository';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';
import { createAdventureHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const KEY = '@my_dungeon_app/adventure';
const LOAD_FAILURE = { success: false, error: `Failed to load ${KEY}` };
const SAVE_FAILURE = { success: false, error: `Failed to save ${KEY}` };

function buildRepository (stored: unknown): { repository: AdventureRepository; storage: { load: jest.Mock; save: jest.Mock; }; } {
    const storage = {
        load: jest.fn().mockResolvedValue({ success: true, data: stored }),
        save: jest.fn().mockResolvedValue({ success: true })
    };
    return { repository: new AdventureRepository(mockLogger, storage as unknown as IStorage), storage };
}

describe('AdventureRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAdventures', () => {
        it('returns the stored adventures', async () => {
            const { repository, storage } = buildRepository([createAdventureHelper({ id: 'adv-1' })]);

            const result = await repository.getAdventures();

            expect(storage.load).toHaveBeenCalledWith(KEY);
            expect(result.success).toBe(true);
            expect(result.adventures?.map(a => a.id)).toEqual(['adv-1']);
        });

        it('returns an empty list when nothing is stored', async () => {
            const { repository } = buildRepository(null);

            const result = await repository.getAdventures();

            expect(result).toEqual({ success: true, adventures: [] });
        });

        it('skips stored entries that are not valid adventures', async () => {
            const { repository } = buildRepository([createAdventureHelper({ id: 'adv-1' }), { id: 'broken' }]);

            const result = await repository.getAdventures();

            expect(result.adventures?.map(a => a.id)).toEqual(['adv-1']);
            expect(mockLogger.warning).toHaveBeenCalledWith('Some adventures were not converted to entity');
        });

        it('fails when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.getAdventures();

            expect(result).toEqual({ success: false, error: 'Failed to load adventures' });
        });

        it('fails when the stored value is not a list', async () => {
            const { repository } = buildRepository({ not: 'a list' });

            const result = await repository.getAdventures();

            expect(result).toEqual({ success: false, error: 'Failed to load adventures' });
        });
    });

    describe('getAdventureById', () => {
        it('returns the adventure with the given id', async () => {
            const { repository } = buildRepository([createAdventureHelper({ id: 'adv-1' }), createAdventureHelper({ id: 'adv-2' })]);

            const result = await repository.getAdventureById('adv-2');

            expect(result.adventure?.id).toBe('adv-2');
        });

        it('succeeds without an adventure when the id is unknown', async () => {
            const { repository } = buildRepository([createAdventureHelper({ id: 'adv-1' })]);

            const result = await repository.getAdventureById('missing');

            expect(result).toEqual({ success: true, adventure: undefined });
        });

        it('propagates a storage failure', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.getAdventureById('adv-1');

            expect(result).toEqual({ success: false, error: 'Failed to load adventures' });
        });
    });

    describe('saveAdventure', () => {
        it('appends the adventure to the stored list', async () => {
            const existing = createAdventureHelper({ id: 'adv-1' });
            const adventure = createAdventureHelper({ id: 'adv-2' });
            const { repository, storage } = buildRepository([existing]);

            const result = await repository.saveAdventure({ adventure });

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, [existing, adventure]);
        });

        it('starts the list when nothing is stored', async () => {
            const adventure = createAdventureHelper({ id: 'adv-1' });
            const { repository, storage } = buildRepository(null);

            await repository.saveAdventure({ adventure });

            expect(storage.save).toHaveBeenCalledWith(KEY, [adventure]);
        });

        it('fails without writing when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.saveAdventure({ adventure: createAdventureHelper() });

            expect(result).toEqual({ success: false, error: 'Failed to save adventure' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository([]);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository.saveAdventure({ adventure: createAdventureHelper() });

            expect(result).toEqual({ success: false, error: 'Failed to save adventure' });
        });
    });

    describe('updateAdventure', () => {
        it('replaces the stored adventure', async () => {
            const kept = createAdventureHelper({ id: 'adv-1' });
            const updated = createAdventureHelper({ id: 'adv-2', name: 'Renamed' });
            const { repository, storage } = buildRepository([kept, createAdventureHelper({ id: 'adv-2' })]);

            const result = await repository.updateAdventure({ adventure: updated });

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, [kept, updated]);
        });

        it.each([
            ['the adventure does not exist', [] as unknown[]],
            ['nothing is stored yet', null]
        ])('fails without writing when %s', async (_, stored) => {
            const { repository, storage } = buildRepository(stored);

            const result = await repository.updateAdventure({ adventure: createAdventureHelper({ id: 'adv-1' }) });

            expect(result).toEqual({ success: false, error: 'Adventure with id adv-1 does not exist' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails without writing when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.updateAdventure({ adventure: createAdventureHelper() });

            expect(result).toEqual({ success: false, error: 'Failed to update adventure' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const adventure = createAdventureHelper({ id: 'adv-1' });
            const { repository, storage } = buildRepository([adventure]);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository.updateAdventure({ adventure });

            expect(result).toEqual({ success: false, error: 'Failed to update adventure' });
        });
    });

    describe('eraseAdventure', () => {
        it('removes the adventure from the stored list', async () => {
            const kept = createAdventureHelper({ id: 'adv-1' });
            const { repository, storage } = buildRepository([kept, createAdventureHelper({ id: 'adv-2' })]);

            const result = await repository.eraseAdventure('adv-2');

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, [kept]);
        });

        it.each([
            ['the adventure does not exist', [] as unknown[]],
            ['nothing is stored yet', null]
        ])('fails without writing when %s', async (_, stored) => {
            const { repository, storage } = buildRepository(stored);

            const result = await repository.eraseAdventure('adv-1');

            expect(result).toEqual({ success: false, error: 'Adventure with id adv-1 does not exist' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails without writing when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository(null);
            storage.load.mockResolvedValue(LOAD_FAILURE);

            const result = await repository.eraseAdventure('adv-1');

            expect(result).toEqual({ success: false, error: 'Failed to erase adventure' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository([createAdventureHelper({ id: 'adv-1' })]);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository.eraseAdventure('adv-1');

            expect(result).toEqual({ success: false, error: 'Failed to erase adventure' });
        });
    });

    describe('eraseAdventures', () => {
        it('replaces the stored list with an empty one', async () => {
            const { repository, storage } = buildRepository([createAdventureHelper()]);

            const result = await repository.eraseAdventures();

            expect(result).toEqual({ success: true });
            expect(storage.save).toHaveBeenCalledWith(KEY, []);
            expect(storage.load).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository([]);
            storage.save.mockResolvedValue(SAVE_FAILURE);

            const result = await repository.eraseAdventures();

            expect(result).toEqual({ success: false, error: 'Failed to erase adventures' });
        });
    });
});
