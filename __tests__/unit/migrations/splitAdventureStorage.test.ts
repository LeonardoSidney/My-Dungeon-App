import { migrateAdventureStorageController } from '@infra/container';
import { splitAdventureStorage } from '@src/migrations/splitAdventureStorage';

jest.mock('@infra/container', () => ({
    migrateAdventureStorageController: jest.fn(),
}));

jest.mock('@infra/container/shared', () => ({
    logger: { debug: jest.fn(), storage: jest.fn(), streaming: jest.fn(), info: jest.fn(), warning: jest.fn(), error: jest.fn(), log: jest.fn() }
}));

const mockController = migrateAdventureStorageController as jest.Mock;

describe('splitAdventureStorage', () => {
    it('runs the adventure storage migration', async () => {
        const handle = jest.fn().mockResolvedValue({ success: true });
        mockController.mockReturnValue({ handle });

        const response = await splitAdventureStorage();

        expect(handle).toHaveBeenCalledTimes(1);
        expect(response).toEqual({ success: true });
    });

    it('fails with the reason when the migration fails', async () => {
        mockController.mockReturnValue({ handle: jest.fn().mockResolvedValue({ success: false, error: 'disk full' }) });

        const response = await splitAdventureStorage();

        expect(response).toEqual({ success: false, error: 'Migration: failed to split the adventure storage: disk full' });
    });
});
