import {
    createWorldController,
    editWorldController,
    getWorldsController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedWorld } from './types';
import { nameIndex, listItems, MigrationReturn } from './shared';

export async function seedWorlds (seeds: SeedWorld[]): Promise<MigrationReturn> {
    const createWorld = createWorldController();
    const editWorld = editWorldController();
    const getWorlds = getWorldsController();
    const existingResponse = listItems(await getWorlds.handle(), 'worlds');
    if (!existingResponse.success || !existingResponse.items) {
        return { success: false, error: existingResponse.error };
    }

    const existing = existingResponse.items;
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding worlds (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createWorld.handle(seed);
            if (!response.success) {
                return { success: false, error: `Migration: failed to create world "${seed.name}": ${response.error}` };
            }
            continue;
        }

        const response = await editWorld.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
            },
        });
        if (!response.success) {
            return { success: false, error: `Migration: failed to restore world "${seed.name}": ${response.error}` };
        }
    }

    return { success: true };
}
