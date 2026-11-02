import { MigrateAdventureStorageUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('MigrateAdventureStorageUseCase', () => {
    it('migrates the legacy storage', async () => {
        const repository = { migrateLegacyStorage: jest.fn().mockResolvedValue({ success: true }) };

        const response = await new MigrateAdventureStorageUseCase(logger, repository as never).execute();

        expect(repository.migrateLegacyStorage).toHaveBeenCalledTimes(1);
        expect(response).toEqual({ success: true });
    });

    it('propagates a repository failure', async () => {
        const repository = { migrateLegacyStorage: jest.fn().mockResolvedValue({ success: false, error: 'Failed to migrate adventures' }) };

        const response = await new MigrateAdventureStorageUseCase(logger, repository as never).execute();

        expect(response).toEqual({ success: false, error: 'Failed to migrate adventures' });
    });
});
