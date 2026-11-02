import { MigrateAdventureStorageController } from '@adapters/controllers';
import { migrateAdventureStorageController } from '@infra/container';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('adventure factories', () => {
    it('migrateAdventureStorageController builds a MigrateAdventureStorageController', () => {
        expect(migrateAdventureStorageController()).toBeInstanceOf(MigrateAdventureStorageController);
    });
});
