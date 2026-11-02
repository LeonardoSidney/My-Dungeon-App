import { AdventureRepository } from '@infra/repository';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const LEGACY_KEY = '@my_dungeon_app/adventure';
const INDEX_KEY = '@my_dungeon_app/adventures';
const BACKUP_KEY = '@my_dungeon_app/adventure_rejected_backup';
const adventureKey = (id: string) => `${LEGACY_KEY}/${id}`;

const FAILURE = { success: false, error: 'disk failure' };

function toEntry (adventure: Adventure) {
    return {
        id: adventure.id,
        name: adventure.name,
        hasStreamingChat: adventure.chat.some(chat => chat.isStreaming),
        createdAt: adventure.createdAt,
        updatedAt: adventure.updatedAt
    };
}

function storedAdventures (...adventures: Adventure[]): Record<string, unknown> {
    const stored: Record<string, unknown> = { [INDEX_KEY]: adventures.map(toEntry) };
    adventures.forEach(adventure => {
        stored[adventureKey(adventure.id)] = adventure;
    });
    return stored;
}

function buildRepository (initial: Record<string, unknown> = {}) {
    const stored = new Map(Object.entries(initial));
    const storage = {
        load: jest.fn(async (name: string) => ({ success: true, data: stored.get(name) ?? null })),
        loadMany: jest.fn(async (names: string[]) => ({
            success: true,
            data: Object.fromEntries(names.map(name => [name, stored.get(name) ?? null]))
        })),
        save: jest.fn(async (name: string, value: unknown) => {
            stored.set(name, value);
            return { success: true };
        }),
        saveMany: jest.fn(async (entries: Record<string, unknown>) => {
            Object.entries(entries).forEach(([name, value]) => stored.set(name, value));
            return { success: true };
        }),
        remove: jest.fn(async (name: string) => {
            stored.delete(name);
            return { success: true };
        }),
        removeMany: jest.fn(async (names: string[]) => {
            names.forEach(name => stored.delete(name));
            return { success: true };
        })
    };
    return { repository: new AdventureRepository(mockLogger, storage as unknown as IStorage), storage, stored };
}

describe('AdventureRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAdventureIndex', () => {
        it('returns the stored entries in order', async () => {
            const { repository } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-2' }), createAdventureHelper({ id: 'adv-1' })));

            const result = await repository.getAdventureIndex();

            expect(result.entries?.map(entry => entry.id)).toEqual(['adv-2', 'adv-1']);
        });

        it('does not read any adventure', async () => {
            const { repository, storage } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-1' })));

            await repository.getAdventureIndex();

            expect(storage.load).toHaveBeenCalledTimes(1);
            expect(storage.load).toHaveBeenCalledWith(INDEX_KEY);
        });

        it('returns an empty list when nothing is stored', async () => {
            const { repository } = buildRepository();

            const result = await repository.getAdventureIndex();

            expect(result).toEqual({ success: true, entries: [] });
        });

        it('skips stored entries that are not valid', async () => {
            const entry = toEntry(createAdventureHelper({ id: 'adv-1' }));
            const { repository } = buildRepository({ [INDEX_KEY]: [entry, { id: 'broken' }] });

            const result = await repository.getAdventureIndex();

            expect(result.entries?.map(item => item.id)).toEqual(['adv-1']);
            expect(mockLogger.warning).toHaveBeenCalledWith('Some adventure index entries were not converted to entity');
        });

        it('fails when the storage cannot be read', async () => {
            const { repository, storage } = buildRepository();
            storage.load.mockResolvedValue({ ...FAILURE, data: null });

            const result = await repository.getAdventureIndex();

            expect(result).toEqual({ success: false, error: 'Failed to load adventures' });
        });

        it('fails when the stored value is not a list', async () => {
            const { repository } = buildRepository({ [INDEX_KEY]: { not: 'a list' } });

            const result = await repository.getAdventureIndex();

            expect(result).toEqual({ success: false, error: 'Failed to load adventures' });
        });
    });

    describe('getAdventures', () => {
        it('returns the full adventures in the index order', async () => {
            const { repository } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-2' }), createAdventureHelper({ id: 'adv-1' })));

            const result = await repository.getAdventures();

            expect(result.adventures?.map(adventure => adventure.id)).toEqual(['adv-2', 'adv-1']);
        });

        it('returns an empty list without reading adventures when the index is empty', async () => {
            const { repository, storage } = buildRepository();

            const result = await repository.getAdventures();

            expect(result).toEqual({ success: true, adventures: [] });
            expect(storage.loadMany).not.toHaveBeenCalled();
        });

        it('skips stored adventures that are not valid', async () => {
            const stored = storedAdventures(createAdventureHelper({ id: 'adv-1' }), createAdventureHelper({ id: 'adv-2' }));
            const { repository } = buildRepository({ ...stored, [adventureKey('adv-2')]: { id: 'adv-2' } });

            const result = await repository.getAdventures();

            expect(result.adventures?.map(adventure => adventure.id)).toEqual(['adv-1']);
            expect(mockLogger.warning).toHaveBeenCalledWith('Some adventures were not converted to entity');
        });

        it('fails when the index cannot be read', async () => {
            const { repository, storage } = buildRepository();
            storage.load.mockResolvedValue({ ...FAILURE, data: null });

            const result = await repository.getAdventures();

            expect(result).toEqual({ success: false, error: 'Failed to load adventures' });
        });

        it('fails when the adventures cannot be read', async () => {
            const { repository, storage } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-1' })));
            storage.loadMany.mockResolvedValue({ ...FAILURE, data: {} });

            const result = await repository.getAdventures();

            expect(result).toEqual({ success: false, error: 'Failed to load adventures' });
        });

        it('fails when the storage returns no adventures', async () => {
            const { repository, storage } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-1' })));
            storage.loadMany.mockResolvedValue({ success: true } as never);

            const result = await repository.getAdventures();

            expect(result).toEqual({ success: false, error: 'Failed to load adventures' });
        });
    });

    describe('getAdventureById', () => {
        it('reads only the key of that adventure', async () => {
            const { repository, storage } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-1' }), createAdventureHelper({ id: 'adv-2' })));

            const result = await repository.getAdventureById('adv-2');

            expect(result.adventure?.id).toBe('adv-2');
            expect(storage.load).toHaveBeenCalledTimes(1);
            expect(storage.load).toHaveBeenCalledWith(adventureKey('adv-2'));
        });

        it('succeeds without an adventure when the id is unknown', async () => {
            const { repository } = buildRepository();

            const result = await repository.getAdventureById('missing');

            expect(result).toEqual({ success: true, adventure: undefined });
        });

        it('succeeds without an adventure when the stored value is not valid', async () => {
            const { repository } = buildRepository({ [adventureKey('adv-1')]: { id: 'adv-1' } });

            const result = await repository.getAdventureById('adv-1');

            expect(result).toEqual({ success: true, adventure: undefined });
            expect(mockLogger.warning).toHaveBeenCalledWith('Adventure with id adv-1 was not converted to entity');
        });

        it('propagates a storage failure', async () => {
            const { repository, storage } = buildRepository();
            storage.load.mockResolvedValue({ ...FAILURE, data: null });

            const result = await repository.getAdventureById('adv-1');

            expect(result).toEqual({ success: false, error: 'Failed to load adventure' });
        });
    });

    describe('saveAdventure', () => {
        it('stores the adventure and appends it to the index', async () => {
            const existing = createAdventureHelper({ id: 'adv-1' });
            const adventure = createAdventureHelper({ id: 'adv-2' });
            const { repository, stored } = buildRepository(storedAdventures(existing));

            const result = await repository.saveAdventure({ adventure });

            expect(result).toEqual({ success: true });
            expect(stored.get(adventureKey('adv-2'))).toEqual(adventure);
            expect(stored.get(INDEX_KEY)).toEqual([toEntry(existing), toEntry(adventure)]);
        });

        it('writes the adventure and the index in one call', async () => {
            const { repository, storage } = buildRepository();

            await repository.saveAdventure({ adventure: createAdventureHelper() });

            expect(storage.saveMany).toHaveBeenCalledTimes(1);
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails without writing when the index cannot be read', async () => {
            const { repository, storage } = buildRepository();
            storage.load.mockResolvedValue({ ...FAILURE, data: null });

            const result = await repository.saveAdventure({ adventure: createAdventureHelper() });

            expect(result).toEqual({ success: false, error: 'Failed to save adventure' });
            expect(storage.saveMany).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository();
            storage.saveMany.mockResolvedValue(FAILURE);

            const result = await repository.saveAdventure({ adventure: createAdventureHelper() });

            expect(result).toEqual({ success: false, error: 'Failed to save adventure' });
        });
    });

    describe('updateAdventure', () => {
        const streamingChat = createChatHelper({ id: 'reply', isStreaming: true });

        it('replaces the adventure and keeps the other index entries', async () => {
            const kept = createAdventureHelper({ id: 'adv-1' });
            const updated = createAdventureHelper({ id: 'adv-2', name: 'Renamed' });
            const { repository, stored } = buildRepository(storedAdventures(kept, createAdventureHelper({ id: 'adv-2' })));

            const result = await repository.updateAdventure({ adventure: updated });

            expect(result).toEqual({ success: true });
            expect(stored.get(adventureKey('adv-2'))).toEqual(updated);
            expect(stored.get(INDEX_KEY)).toEqual([toEntry(kept), toEntry(updated)]);
        });

        it('does not touch the other adventures', async () => {
            const kept = createAdventureHelper({ id: 'adv-1' });
            const adventure = createAdventureHelper({ id: 'adv-2' });
            const { repository, storage } = buildRepository(storedAdventures(kept, adventure));

            await repository.updateAdventure({ adventure });

            expect(Object.keys(storage.saveMany.mock.calls[0][0])).toEqual([adventureKey('adv-2'), INDEX_KEY]);
        });

        it('flags the index when a stream starts', async () => {
            const adventure = createAdventureHelper({ id: 'adv-1' });
            const { repository, stored } = buildRepository(storedAdventures(adventure));

            await repository.updateAdventure({ adventure: { ...adventure, chat: [streamingChat] } });

            expect(stored.get(INDEX_KEY)).toEqual([expect.objectContaining({ id: 'adv-1', hasStreamingChat: true })]);
        });

        it('writes only the adventure on a streaming tick', async () => {
            const adventure = createAdventureHelper({ id: 'adv-1', chat: [streamingChat] });
            const { repository, storage } = buildRepository(storedAdventures(adventure));

            const result = await repository.updateAdventure({ adventure: { ...adventure, updatedAt: new Date('2026-02-01T00:00:00.000Z') } });

            expect(result).toEqual({ success: true });
            expect(storage.saveMany).not.toHaveBeenCalled();
            expect(storage.save).toHaveBeenCalledTimes(1);
            expect(storage.save.mock.calls[0][0]).toBe(adventureKey('adv-1'));
        });

        it('clears the flag and refreshes the index when the stream finishes', async () => {
            const adventure = createAdventureHelper({ id: 'adv-1', chat: [streamingChat] });
            const updatedAt = new Date('2026-02-01T00:00:00.000Z');
            const { repository, stored } = buildRepository(storedAdventures(adventure));

            await repository.updateAdventure({ adventure: { ...adventure, chat: [{ ...streamingChat, isStreaming: false }], updatedAt } });

            expect(stored.get(INDEX_KEY)).toEqual([expect.objectContaining({ hasStreamingChat: false, updatedAt })]);
        });

        it('updates the index when an adventure is renamed during a stream', async () => {
            const adventure = createAdventureHelper({ id: 'adv-1', chat: [streamingChat] });
            const { repository, stored } = buildRepository(storedAdventures(adventure));

            await repository.updateAdventure({ adventure: { ...adventure, name: 'Renamed' } });

            expect(stored.get(INDEX_KEY)).toEqual([expect.objectContaining({ name: 'Renamed', hasStreamingChat: true })]);
        });

        it('fails without writing when the adventure is not in the index', async () => {
            const { repository, storage } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-2' })));

            const result = await repository.updateAdventure({ adventure: createAdventureHelper({ id: 'adv-1' }) });

            expect(result).toEqual({ success: false, error: 'Adventure with id adv-1 does not exist' });
            expect(storage.saveMany).not.toHaveBeenCalled();
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails without writing when nothing is stored yet', async () => {
            const { repository, storage } = buildRepository();

            const result = await repository.updateAdventure({ adventure: createAdventureHelper({ id: 'adv-1' }) });

            expect(result).toEqual({ success: false, error: 'Adventure with id adv-1 does not exist' });
            expect(storage.saveMany).not.toHaveBeenCalled();
        });

        it('fails without writing when the index cannot be read', async () => {
            const { repository, storage } = buildRepository();
            storage.load.mockResolvedValue({ ...FAILURE, data: null });

            const result = await repository.updateAdventure({ adventure: createAdventureHelper() });

            expect(result).toEqual({ success: false, error: 'Failed to update adventure' });
            expect(storage.saveMany).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const adventure = createAdventureHelper({ id: 'adv-1' });
            const { repository, storage } = buildRepository(storedAdventures(adventure));
            storage.saveMany.mockResolvedValue(FAILURE);

            const result = await repository.updateAdventure({ adventure });

            expect(result).toEqual({ success: false, error: 'Failed to update adventure' });
        });

        it('fails when a streaming tick cannot be written', async () => {
            const adventure = createAdventureHelper({ id: 'adv-1', chat: [streamingChat] });
            const { repository, storage } = buildRepository(storedAdventures(adventure));
            storage.save.mockResolvedValue(FAILURE);

            const result = await repository.updateAdventure({ adventure });

            expect(result).toEqual({ success: false, error: 'Failed to update adventure' });
        });
    });

    describe('eraseAdventure', () => {
        it('removes the adventure and its index entry', async () => {
            const kept = createAdventureHelper({ id: 'adv-1' });
            const { repository, stored } = buildRepository(storedAdventures(kept, createAdventureHelper({ id: 'adv-2' })));

            const result = await repository.eraseAdventure('adv-2');

            expect(result).toEqual({ success: true });
            expect(stored.get(INDEX_KEY)).toEqual([toEntry(kept)]);
            expect(stored.has(adventureKey('adv-2'))).toBe(false);
            expect(stored.has(adventureKey('adv-1'))).toBe(true);
        });

        it('removes the index entry before the adventure', async () => {
            const { repository, storage } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-1' })));

            await repository.eraseAdventure('adv-1');

            expect(storage.save.mock.invocationCallOrder[0]).toBeLessThan(storage.remove.mock.invocationCallOrder[0]);
        });

        it('fails without writing when the adventure does not exist', async () => {
            const { repository, storage } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-2' })));

            const result = await repository.eraseAdventure('adv-1');

            expect(result).toEqual({ success: false, error: 'Adventure with id adv-1 does not exist' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails without writing when nothing is stored yet', async () => {
            const { repository, storage } = buildRepository();

            const result = await repository.eraseAdventure('adv-1');

            expect(result).toEqual({ success: false, error: 'Adventure with id adv-1 does not exist' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('fails without writing when the index cannot be read', async () => {
            const { repository, storage } = buildRepository();
            storage.load.mockResolvedValue({ ...FAILURE, data: null });

            const result = await repository.eraseAdventure('adv-1');

            expect(result).toEqual({ success: false, error: 'Failed to erase adventure' });
            expect(storage.save).not.toHaveBeenCalled();
        });

        it('keeps the adventure when the index cannot be written', async () => {
            const { repository, storage } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-1' })));
            storage.save.mockResolvedValue(FAILURE);

            const result = await repository.eraseAdventure('adv-1');

            expect(result).toEqual({ success: false, error: 'Failed to erase adventure' });
            expect(storage.remove).not.toHaveBeenCalled();
        });

        it('fails when the adventure cannot be removed', async () => {
            const { repository, storage } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-1' })));
            storage.remove.mockResolvedValue(FAILURE);

            const result = await repository.eraseAdventure('adv-1');

            expect(result).toEqual({ success: false, error: 'Failed to erase adventure' });
        });
    });

    describe('eraseAdventures', () => {
        it('removes the index and every adventure', async () => {
            const { repository, stored } = buildRepository(storedAdventures(createAdventureHelper({ id: 'adv-1' }), createAdventureHelper({ id: 'adv-2' })));

            const result = await repository.eraseAdventures();

            expect(result).toEqual({ success: true });
            expect(stored.size).toBe(0);
        });

        it('fails when the index cannot be read', async () => {
            const { repository, storage } = buildRepository();
            storage.load.mockResolvedValue({ ...FAILURE, data: null });

            const result = await repository.eraseAdventures();

            expect(result).toEqual({ success: false, error: 'Failed to erase adventures' });
            expect(storage.removeMany).not.toHaveBeenCalled();
        });

        it('fails when the storage cannot be written', async () => {
            const { repository, storage } = buildRepository();
            storage.removeMany.mockResolvedValue(FAILURE);

            const result = await repository.eraseAdventures();

            expect(result).toEqual({ success: false, error: 'Failed to erase adventures' });
        });
    });

    describe('migrateLegacyStorage', () => {
        const first = createAdventureHelper({ id: 'adv-1', name: 'First' });
        const interrupted = createAdventureHelper({ id: 'adv-2', name: 'Second', chat: [createChatHelper({ id: 'reply', isStreaming: true })] });

        it('does nothing when there is no legacy data', async () => {
            const { repository, storage } = buildRepository();

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: true });
            expect(storage.saveMany).not.toHaveBeenCalled();
            expect(storage.remove).not.toHaveBeenCalled();
        });

        it('splits the legacy list and removes it', async () => {
            const { repository, stored } = buildRepository({ [LEGACY_KEY]: [first, interrupted] });

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: true });
            expect(stored.get(adventureKey('adv-1'))).toEqual(first);
            expect(stored.get(adventureKey('adv-2'))).toEqual(interrupted);
            expect(stored.get(INDEX_KEY)).toEqual([toEntry(first), toEntry(interrupted)]);
            expect(stored.has(LEGACY_KEY)).toBe(false);
        });

        it('flags the adventures that were interrupted before the migration', async () => {
            const { repository, stored } = buildRepository({ [LEGACY_KEY]: [interrupted] });

            await repository.migrateLegacyStorage();

            expect(stored.get(INDEX_KEY)).toEqual([expect.objectContaining({ hasStreamingChat: true })]);
        });

        it('shrinks the legacy list with each copied adventure', async () => {
            const { repository, storage } = buildRepository({ [LEGACY_KEY]: [first, interrupted] });

            await repository.migrateLegacyStorage();

            expect(storage.saveMany).toHaveBeenCalledTimes(2);
            expect(storage.saveMany.mock.calls[0][0][LEGACY_KEY]).toEqual([interrupted]);
            expect(storage.saveMany.mock.calls[1][0][LEGACY_KEY]).toEqual([]);
        });

        it('keeps the stored object untouched', async () => {
            const brokenChat = { id: 'broken' };
            const raw = { ...first, chat: [brokenChat] };
            const { repository, stored } = buildRepository({ [LEGACY_KEY]: [raw] });

            await repository.migrateLegacyStorage();

            expect(stored.get(adventureKey('adv-1'))).toEqual(raw);
        });

        it('backs up the adventures it cannot read', async () => {
            const rejected = { id: 'broken' };
            const { repository, stored } = buildRepository({ [LEGACY_KEY]: [first, rejected] });

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: true });
            expect(stored.get(BACKUP_KEY)).toEqual([rejected]);
            expect(stored.get(INDEX_KEY)).toEqual([toEntry(first)]);
        });

        it('removes an empty legacy list', async () => {
            const { repository, stored } = buildRepository({ [LEGACY_KEY]: [] });

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: true });
            expect(stored.has(LEGACY_KEY)).toBe(false);
        });

        it('resumes after failing halfway', async () => {
            const { repository, storage, stored } = buildRepository({ [LEGACY_KEY]: [first, interrupted] });
            const saveMany = storage.saveMany.getMockImplementation();
            storage.saveMany.mockImplementationOnce(saveMany as never).mockResolvedValueOnce(FAILURE);

            const failed = await repository.migrateLegacyStorage();
            const retried = await repository.migrateLegacyStorage();

            expect(failed).toEqual({ success: false, error: 'Failed to migrate adventures' });
            expect(retried).toEqual({ success: true });
            expect(stored.get(INDEX_KEY)).toEqual([toEntry(first), toEntry(interrupted)]);
            expect(stored.has(LEGACY_KEY)).toBe(false);
        });

        it('does not duplicate an index entry when an adventure is copied twice', async () => {
            const { repository, stored } = buildRepository({
                [LEGACY_KEY]: [first],
                [INDEX_KEY]: [toEntry(first)],
                [adventureKey('adv-1')]: first
            });

            await repository.migrateLegacyStorage();

            expect(stored.get(INDEX_KEY)).toEqual([toEntry(first)]);
        });

        it('fails when the legacy data cannot be read', async () => {
            const { repository, storage } = buildRepository();
            storage.load.mockResolvedValue({ ...FAILURE, data: null });

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: false, error: 'Failed to migrate adventures' });
        });

        it('fails without removing legacy data that is not a list', async () => {
            const { repository, stored } = buildRepository({ [LEGACY_KEY]: { not: 'a list' } });

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: false, error: 'Failed to migrate adventures' });
            expect(stored.has(LEGACY_KEY)).toBe(true);
        });

        it('fails without copying when the index cannot be read', async () => {
            const { repository, storage } = buildRepository({ [LEGACY_KEY]: [first], [INDEX_KEY]: { not: 'a list' } });

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: false, error: 'Failed to migrate adventures' });
            expect(storage.saveMany).not.toHaveBeenCalled();
        });

        it('fails without copying when the rejected adventures cannot be backed up', async () => {
            const { repository, storage } = buildRepository({ [LEGACY_KEY]: [first, { id: 'broken' }] });
            storage.save.mockResolvedValue(FAILURE);

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: false, error: 'Failed to migrate adventures' });
            expect(storage.saveMany).not.toHaveBeenCalled();
        });

        it('keeps the legacy data when an adventure cannot be copied', async () => {
            const { repository, storage, stored } = buildRepository({ [LEGACY_KEY]: [first] });
            storage.saveMany.mockResolvedValue(FAILURE);

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: false, error: 'Failed to migrate adventures' });
            expect(stored.get(LEGACY_KEY)).toEqual([first]);
            expect(storage.remove).not.toHaveBeenCalled();
        });

        it('fails when the legacy data cannot be removed', async () => {
            const { repository, storage } = buildRepository({ [LEGACY_KEY]: [first] });
            storage.remove.mockResolvedValue(FAILURE);

            const result = await repository.migrateLegacyStorage();

            expect(result).toEqual({ success: false, error: 'Failed to migrate adventures' });
        });
    });
});
