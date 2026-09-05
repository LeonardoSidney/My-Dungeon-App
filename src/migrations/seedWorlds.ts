import {
    createWorldController,
    editWorldController,
    getWorldsController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedWorld } from './types';
import { nameIndex } from './shared';

export async function seedWorlds (seeds: SeedWorld[]): Promise<void> {
    const createWorld = createWorldController();
    const editWorld = editWorldController();
    const getWorlds = getWorldsController();
    const existing = await getWorlds.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding worlds (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createWorld.handle(seed);
            if (!response.success) {
                throw new Error(`Migration: failed to create world "${seed.name}": ${response.error}`);
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
            throw new Error(`Migration: failed to restore world "${seed.name}": ${response.error}`);
        }
    }
}
