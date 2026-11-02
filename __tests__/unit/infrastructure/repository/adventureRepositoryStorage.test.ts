import AsyncStorage from '@react-native-async-storage/async-storage';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { AdventureRepository } from '@infra/repository';
import { MobileStorage } from '@infra/storage';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

jest.mock('@react-native-async-storage/async-storage', () => {
    const mockStored = new Map<string, string>();

    return {
        clear: () => mockStored.clear(),
        getItem: async (key: string) => mockStored.get(key) ?? null,
        setItem: async (key: string, value: string) => {
            mockStored.set(key, value);
        },
        getMany: async (keys: string[]) => Object.fromEntries(keys.map(key => [key, mockStored.get(key) ?? null])),
        setMany: async (entries: Record<string, string>) => {
            Object.entries(entries).forEach(([key, value]) => mockStored.set(key, value));
        },
        removeItem: async (key: string) => {
            mockStored.delete(key);
        },
        removeMany: async (keys: string[]) => {
            keys.forEach(key => mockStored.delete(key));
        },
    };
});

const logger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const LEGACY_KEY = '@my_dungeon_app/adventure';

const repository = new AdventureRepository(logger, new MobileStorage(logger));
const reply = createChatHelper({ id: 'reply', isStreaming: true });

async function seedLegacy (adventures: Adventure[]): Promise<void> {
    await AsyncStorage.setItem(LEGACY_KEY, JSON.stringify(adventures));
}

describe('AdventureRepository on a real serialized storage', () => {
    beforeEach(async () => {
        await AsyncStorage.clear();
    });

    it('keeps every field of a migrated adventure', async () => {
        const adventure = createAdventureHelper({ id: 'adv-1', chat: [reply], characterIds: ['hero'] });
        await seedLegacy([adventure]);

        await repository.migrateLegacyStorage();
        const result = await repository.getAdventureById('adv-1');

        expect(result.adventure).toEqual(adventure);
    });

    it('lists the migrated adventures with the same data as before', async () => {
        const adventures = [createAdventureHelper({ id: 'adv-1', name: 'First' }), createAdventureHelper({ id: 'adv-2', name: 'Second' })];
        await seedLegacy(adventures);

        await repository.migrateLegacyStorage();
        const result = await repository.getAdventures();

        expect(result.adventures).toEqual(adventures);
    });

    it('does nothing on the next boot', async () => {
        await seedLegacy([createAdventureHelper({ id: 'adv-1' })]);
        await repository.migrateLegacyStorage();
        const setMany = jest.spyOn(AsyncStorage, 'setMany');

        const result = await repository.migrateLegacyStorage();

        expect(result).toEqual({ success: true });
        expect(setMany).not.toHaveBeenCalled();
    });

    it('exposes an interrupted reply through the index across a whole stream', async () => {
        const adventure = createAdventureHelper({ id: 'adv-1' });
        await repository.saveAdventure({ adventure });

        await repository.updateAdventure({ adventure: { ...adventure, chat: [reply] } });
        const streaming = await repository.getAdventureIndex();
        await repository.updateAdventure({ adventure: { ...adventure, chat: [{ ...reply, content: ['partial'] }] } });
        const ticking = await repository.getAdventureIndex();
        await repository.updateAdventure({ adventure: { ...adventure, chat: [{ ...reply, isStreaming: false }] } });
        const finished = await repository.getAdventureIndex();

        expect(streaming.entries?.[0].hasStreamingChat).toBe(true);
        expect(ticking.entries?.[0].hasStreamingChat).toBe(true);
        expect(finished.entries?.[0].hasStreamingChat).toBe(false);
    });

    it('persists the content of a streaming tick', async () => {
        const adventure = createAdventureHelper({ id: 'adv-1', chat: [reply] });
        await repository.saveAdventure({ adventure });

        await repository.updateAdventure({ adventure: { ...adventure, chat: [{ ...reply, content: ['partial'] }] } });
        const result = await repository.getAdventureById('adv-1');

        expect(result.adventure?.chat[0].content).toEqual(['partial']);
    });

    it('keeps two adventures streaming at the same time', async () => {
        const first = createAdventureHelper({ id: 'adv-1', chat: [reply] });
        const second = createAdventureHelper({ id: 'adv-2', chat: [reply] });
        await repository.saveAdventure({ adventure: first });
        await repository.saveAdventure({ adventure: second });

        await Promise.all([
            repository.updateAdventure({ adventure: { ...first, chat: [{ ...reply, content: ['first'] }] } }),
            repository.updateAdventure({ adventure: { ...second, chat: [{ ...reply, content: ['second'] }] } }),
        ]);
        const firstResult = await repository.getAdventureById('adv-1');
        const secondResult = await repository.getAdventureById('adv-2');

        expect(firstResult.adventure?.chat[0].content).toEqual(['first']);
        expect(secondResult.adventure?.chat[0].content).toEqual(['second']);
    });
});
