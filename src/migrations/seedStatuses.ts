import {
    createStatusController,
    editStatusController,
    getStatusesController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedStatus } from './types';
import { nameIndex, listItems, MigrationReturn } from './shared';

export async function seedStatuses (seeds: SeedStatus[]): Promise<MigrationReturn> {
    const createStatus = createStatusController();
    const editStatus = editStatusController();
    const getStatuses = getStatusesController();
    const existingResponse = listItems(await getStatuses.handle(), 'statuses');
    if (!existingResponse.success || !existingResponse.items) {
        return { success: false, error: existingResponse.error };
    }

    const existing = existingResponse.items;
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding statuses (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createStatus.handle(seed);
            if (!response.success) {
                return { success: false, error: `Migration: failed to create status "${seed.name}": ${response.error}` };
            }
            continue;
        }

        const response = await editStatus.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
            },
        });
        if (!response.success) {
            return { success: false, error: `Migration: failed to restore status "${seed.name}": ${response.error}` };
        }
    }

    return { success: true };
}
