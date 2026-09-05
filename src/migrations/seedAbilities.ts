import {
    createAbilityController,
    editAbilityController,
    getAbilitiesController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedAbility } from './types';
import { nameIndex } from './shared';

export async function seedAbilities (seeds: SeedAbility[]): Promise<void> {
    const createAbility = createAbilityController();
    const editAbility = editAbilityController();
    const getAbilities = getAbilitiesController();
    const existing = await getAbilities.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding abilities (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createAbility.handle(seed);
            if (!response.success) {
                throw new Error(`Migration: failed to create ability "${seed.name}": ${response.error}`);
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
            throw new Error(`Migration: failed to restore ability "${seed.name}": ${response.error}`);
        }
    }
}
