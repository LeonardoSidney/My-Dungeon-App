import {
    createStatusController,
    editStatusController,
    getStatusesController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedStatus } from './types';
import { nameIndex } from './shared';

export async function seedStatuses (seeds: SeedStatus[]): Promise<void> {
    const createStatus = createStatusController();
    const editStatus = editStatusController();
    const getStatuses = getStatusesController();
    const existing = await getStatuses.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding statuses (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createStatus.handle(seed);
            if (!response.success) {
                throw new Error(`Migration: failed to create status "${seed.name}": ${response.error}`);
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
            throw new Error(`Migration: failed to restore status "${seed.name}": ${response.error}`);
        }
    }
}
