import {
    createProficiencyController,
    editProficiencyController,
    getProficienciesController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedProficiency } from './types';
import { nameIndex } from './shared';

export async function seedProficiencies (seeds: SeedProficiency[]): Promise<void> {
    const createProficiency = createProficiencyController();
    const editProficiency = editProficiencyController();
    const getProficiencies = getProficienciesController();
    const existing = await getProficiencies.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding proficiencies (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createProficiency.handle(seed);
            if (!response.success) {
                throw new Error(`Migration: failed to create proficiency "${seed.name}": ${response.error}`);
            }
            continue;
        }

        const response = await editProficiency.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
            },
        });
        if (!response.success) {
            throw new Error(`Migration: failed to restore proficiency "${seed.name}": ${response.error}`);
        }
    }
}
