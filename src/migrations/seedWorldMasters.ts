import {
    createWorldMasterController,
    editWorldMasterController,
    getWorldMasterController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { Assistant } from '@domain/entities';
import { SeedWorldMaster } from './types';
import { nameIndex } from './shared';

export async function seedWorldMasters (
    seeds: SeedWorldMaster[],
    assistants: Assistant[]
): Promise<void> {
    const createWorldMaster = createWorldMasterController();
    const editWorldMaster = editWorldMasterController();
    const getWorldMasters = getWorldMasterController();
    const existing = await getWorldMasters.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding world masters (${seeds.length} seed(s))`);

    const assistantIndex = nameIndex(assistants);

    for (const seed of seeds) {
        const assistant = assistantIndex.get(seed.assistant);
        if (!assistant) {
            throw new Error(`Migration: assistant "${seed.assistant}" for world master "${seed.name}" does not exist`);
        }

        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createWorldMaster.handle({
                name: seed.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
                assistantId: assistant.id,
            });
            if (!response.success) {
                throw new Error(`Migration: failed to create world master "${seed.name}": ${response.error}`);
            }
            continue;
        }

        const response = await editWorldMaster.handle({
            id: current.id,
            editParams: {
                name: current.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
                assistantId: assistant.id,
            },
        });
        if (!response.success) {
            throw new Error(`Migration: failed to restore world master "${seed.name}": ${response.error}`);
        }
    }
}
