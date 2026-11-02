import { migrateAdventureStorageController } from '@infra/container';
import { logger } from '@infra/container/shared';
import { MigrationReturn } from './shared';

export async function splitAdventureStorage (): Promise<MigrationReturn> {
    const migrateAdventureStorage = migrateAdventureStorageController();
    logger.info('Migration: splitting the adventure storage');

    const response = await migrateAdventureStorage.handle();
    if (!response.success) {
        return { success: false, error: `Migration: failed to split the adventure storage: ${response.error}` };
    }

    return { success: true };
}
