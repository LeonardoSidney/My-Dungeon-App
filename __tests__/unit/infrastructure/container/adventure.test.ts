import { GetAdventureMissingReferencesController, MigrateAdventureStorageController } from '@adapters/controllers';
import { getAdventureMissingReferencesController, migrateAdventureStorageController } from '@infra/container';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('adventure factories', () => {
    it('migrateAdventureStorageController builds a MigrateAdventureStorageController', () => {
        expect(migrateAdventureStorageController()).toBeInstanceOf(MigrateAdventureStorageController);
    });

    it('getAdventureMissingReferencesController builds a GetAdventureMissingReferencesController', () => {
        expect(getAdventureMissingReferencesController()).toBeInstanceOf(GetAdventureMissingReferencesController);
    });
});
