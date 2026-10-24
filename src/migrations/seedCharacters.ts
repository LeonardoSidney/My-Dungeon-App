import {
    createCharacterController,
    editCharacterController,
    getCharactersController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedCharacter } from './types';
import { nameIndex, resolveReferencedIds, listItems, NamedEntity, MigrationReturn } from './shared';

export async function seedCharacters (
    seeds: SeedCharacter[],
    assistants: NamedEntity[],
    abilities: NamedEntity[],
    proficiencies: NamedEntity[],
    statuses: NamedEntity[]
): Promise<MigrationReturn> {
    const createCharacter = createCharacterController();
    const editCharacter = editCharacterController();
    const getCharacters = getCharactersController();
    const existingResponse = listItems(await getCharacters.handle(), 'characters');
    if (!existingResponse.success || !existingResponse.items) {
        return { success: false, error: existingResponse.error };
    }

    const existing = existingResponse.items;
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
            return { success: false, error: `Migration: assistant "${seed.assistant}" for ${ownerLabel} does not exist` };
        }

        const abilityIdsResponse = resolveReferencedIds(abilityIndex, seed.abilities ?? [], 'ability', ownerLabel);
        if (!abilityIdsResponse.success || !abilityIdsResponse.ids) {
            return { success: false, error: abilityIdsResponse.error };
        }

        const abilityIds = abilityIdsResponse.ids;
        const proficiencyIdsResponse = resolveReferencedIds(proficiencyIndex, seed.proficiencies ?? [], 'proficiency', ownerLabel);
        if (!proficiencyIdsResponse.success || !proficiencyIdsResponse.ids) {
            return { success: false, error: proficiencyIdsResponse.error };
        }

        const proficiencyIds = proficiencyIdsResponse.ids;
        const statusIdsResponse = resolveReferencedIds(statusIndex, seed.statuses ?? [], 'status', ownerLabel);
        if (!statusIdsResponse.success || !statusIdsResponse.ids) {
            return { success: false, error: statusIdsResponse.error };
        }

        const statusIds = statusIdsResponse.ids;

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
                return { success: false, error: `Migration: failed to create character "${seed.name}": ${response.error}` };
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
            return { success: false, error: `Migration: failed to restore character "${seed.name}": ${response.error}` };
        }
    }

    return { success: true };
}
