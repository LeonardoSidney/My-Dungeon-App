import {
    createCharacterController,
    editCharacterController,
    getCharactersController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { Ability, Assistant, Proficiency, Status } from '@domain/entities';
import { SeedCharacter } from './types';
import { nameIndex, resolveReferencedIds } from './shared';

export async function seedCharacters (
    seeds: SeedCharacter[],
    assistants: Assistant[],
    abilities: Ability[],
    proficiencies: Proficiency[],
    statuses: Status[]
): Promise<void> {
    const createCharacter = createCharacterController();
    const editCharacter = editCharacterController();
    const getCharacters = getCharactersController();
    const existing = await getCharacters.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding characters (${seeds.length} seed(s))`);

    const assistantIndex = nameIndex(assistants);
    const abilityIndex = nameIndex(abilities);
    const proficiencyIndex = nameIndex(proficiencies);
    const statusIndex = nameIndex(statuses);

    for (const seed of seeds) {
        const ownerLabel = `character "${seed.name}"`;

        const assistant = assistantIndex.get(seed.assistant);
        if (!assistant) {
            throw new Error(`Migration: assistant "${seed.assistant}" for ${ownerLabel} does not exist`);
        }

        const abilityIds = resolveReferencedIds(abilityIndex, seed.abilities ?? [], 'ability', ownerLabel);
        const proficiencyIds = resolveReferencedIds(proficiencyIndex, seed.proficiencies ?? [], 'proficiency', ownerLabel);
        const statusIds = resolveReferencedIds(statusIndex, seed.statuses ?? [], 'status', ownerLabel);

        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createCharacter.handle({
                name: seed.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
                assistantId: assistant.id,
                abilityIds,
                proficiencyIds,
                statusIds,
                attributes: seed.attributes,
            });
            if (!response.success) {
                throw new Error(`Migration: failed to create character "${seed.name}": ${response.error}`);
            }
            continue;
        }

        const response = await editCharacter.handle({
            id: current.id,
            editParams: {
                name: current.name,
                activationWord: seed.activationWord,
                prompt: seed.prompt,
                observation: seed.observation,
                assistantId: assistant.id,
                abilityIds,
                proficiencyIds,
                statusIds,
                attributes: seed.attributes,
            },
        });
        if (!response.success) {
            throw new Error(`Migration: failed to restore character "${seed.name}": ${response.error}`);
        }
    }
}
