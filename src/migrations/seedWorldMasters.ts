import {
    createWorldMasterController,
    editWorldMasterController,
    getWorldMastersController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedWorldMaster } from './types';
import { nameIndex, listItems, NamedEntity, MigrationReturn } from './shared';

export async function seedWorldMasters (
    seeds: SeedWorldMaster[],
    assistants: NamedEntity[]
): Promise<MigrationReturn> {
    const createWorldMaster = createWorldMasterController();
    const editWorldMaster = editWorldMasterController();
    const getWorldMasters = getWorldMastersController();
    const existingResponse = listItems(await getWorldMasters.handle(), 'world masters');
    if (!existingResponse.success || !existingResponse.items) {
        return { success: false, error: existingResponse.error };
    }

    const existing = existingResponse.items;
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding world masters (${seeds.length} seed(s))`);

    const assistantIndex = nameIndex(assistants);

    for (const seed of seeds) {
        const assistant = assistantIndex.get(seed.assistant);
        if (!assistant) {
            return { success: false, error: `Migration: assistant "${seed.assistant}" for world master "${seed.name}" does not exist` };
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
                return { success: false, error: `Migration: failed to create world master "${seed.name}": ${response.error}` };
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
            return { success: false, error: `Migration: failed to restore world master "${seed.name}": ${response.error}` };
        }
    }

    return { success: true };
}
