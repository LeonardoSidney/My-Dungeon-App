import { MigrateAdventureStorageController } from '@adapters/controllers';
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

describe('MigrateAdventureStorageController', () => {
    it('returns the use case result', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Failed to migrate adventures' });

        const response = await new MigrateAdventureStorageController(logger, { execute }).handle();

        expect(execute).toHaveBeenCalledTimes(1);
        expect(response).toEqual({ success: false, error: 'Failed to migrate adventures' });
    });
});
