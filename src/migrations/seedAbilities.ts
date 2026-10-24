import {
    createAbilityController,
    editAbilityController,
    getAbilitiesController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedAbility } from './types';
import { nameIndex, listItems, MigrationReturn } from './shared';

export async function seedAbilities (seeds: SeedAbility[]): Promise<MigrationReturn> {
    const createAbility = createAbilityController();
    const editAbility = editAbilityController();
    const getAbilities = getAbilitiesController();
    const existingResponse = listItems(await getAbilities.handle(), 'abilities');
    if (!existingResponse.success || !existingResponse.items) {
        return { success: false, error: existingResponse.error };
    }

    const existing = existingResponse.items;
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding abilities (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createAbility.handle(seed);
            if (!response.success) {
                return { success: false, error: `Migration: failed to create ability "${seed.name}": ${response.error}` };
            }
            continue;
        }

        const response = await editAbility.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
            },
        });
        if (!response.success) {
            return { success: false, error: `Migration: failed to restore ability "${seed.name}": ${response.error}` };
        }
    }

    return { success: true };
}
