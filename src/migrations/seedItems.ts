import {
    createItemController,
    editItemController,
    getItemsController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedItem } from './types';
import { nameIndex } from './shared';

export async function seedItems (seeds: SeedItem[]): Promise<void> {
    const createItem = createItemController();
    const editItem = editItemController();
    const getItems = getItemsController();
    const existing = await getItems.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding items (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createItem.handle(seed);
            if (!response.success) {
                throw new Error(`Migration: failed to create item "${seed.name}": ${response.error}`);
            }
            continue;
        }

        const response = await editItem.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
            },
        });
        if (!response.success) {
            throw new Error(`Migration: failed to restore item "${seed.name}": ${response.error}`);
        }
    }
}
