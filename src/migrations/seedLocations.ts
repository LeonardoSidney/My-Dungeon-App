import {
    createLocationController,
    editLocationController,
    getLocationsController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedLocation } from './types';
import { nameIndex, listItems, MigrationReturn } from './shared';

export async function seedLocations (seeds: SeedLocation[]): Promise<MigrationReturn> {
    const createLocation = createLocationController();
    const editLocation = editLocationController();
    const getLocations = getLocationsController();
    const existingResponse = listItems(await getLocations.handle(), 'locations');
    if (!existingResponse.success || !existingResponse.items) {
        return { success: false, error: existingResponse.error };
    }

    const existing = existingResponse.items;
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding locations (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createLocation.handle(seed);
            if (!response.success) {
                return { success: false, error: `Migration: failed to create location "${seed.name}": ${response.error}` };
            }
            continue;
        }

        const response = await editLocation.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
            },
        });
        if (!response.success) {
            return { success: false, error: `Migration: failed to restore location "${seed.name}": ${response.error}` };
        }
    }

    return { success: true };
}
