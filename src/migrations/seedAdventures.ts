import {
    createAdventureController,
    editAdventureController,
    getAdventuresController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedAdventure } from './types';
import { nameIndex, resolveReferencedIds, listItems, NamedEntity, MigrationReturn } from './shared';

export async function seedAdventures (
    seeds: SeedAdventure[],
    characters: NamedEntity[],
    worldMasters: NamedEntity[],
    systemPrompts: NamedEntity[],
    worlds: NamedEntity[],
    locations: NamedEntity[],
    items: NamedEntity[]
): Promise<MigrationReturn> {
    const createAdventure = createAdventureController();
    const editAdventure = editAdventureController();
    const getAdventures = getAdventuresController();
    const existingResponse = listItems(await getAdventures.handle(), 'adventures');
    if (!existingResponse.success || !existingResponse.items) {
        return { success: false, error: existingResponse.error };
    }

    const existing = existingResponse.items;
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding adventures (${seeds.length} seed(s))`);

    const characterIndex = nameIndex(characters);
    const worldMasterIndex = nameIndex(worldMasters);
    const systemPromptIndex = nameIndex(systemPrompts);
    const worldIndex = nameIndex(worlds);
    const locationIndex = nameIndex(locations);
    const itemIndex = nameIndex(items);

    for (const seed of seeds) {
        const ownerLabel = `adventure "${seed.name}"`;
        const worldMasterIdsResponse = resolveReferencedIds(worldMasterIndex, seed.worldMaster ? [seed.worldMaster] : [], 'world master', ownerLabel);
        if (!worldMasterIdsResponse.success || !worldMasterIdsResponse.ids) {
            return { success: false, error: worldMasterIdsResponse.error };
        }

        const worldMasterId = worldMasterIdsResponse.ids[0];

        const characterIdsResponse = resolveReferencedIds(characterIndex, seed.characters, 'character', ownerLabel);
        if (!characterIdsResponse.success || !characterIdsResponse.ids) {
            return { success: false, error: characterIdsResponse.error };
        }

        const characterIds = characterIdsResponse.ids;
        const aiControlledCharacterIdsResponse = resolveReferencedIds(characterIndex, seed.charactersControlledByAi, 'character', ownerLabel);
        if (!aiControlledCharacterIdsResponse.success || !aiControlledCharacterIdsResponse.ids) {
            return { success: false, error: aiControlledCharacterIdsResponse.error };
        }

        const aiControlledCharacterIds = aiControlledCharacterIdsResponse.ids;
        const playableCharacterIds = characterIds.filter(id => !aiControlledCharacterIds.includes(id));
        const systemPromptIdsResponse = resolveReferencedIds(systemPromptIndex, seed.systemPrompts, 'system prompt', ownerLabel);
        if (!systemPromptIdsResponse.success || !systemPromptIdsResponse.ids) {
            return { success: false, error: systemPromptIdsResponse.error };
        }

        const systemPromptIds = systemPromptIdsResponse.ids;
        const worldIdsResponse = resolveReferencedIds(worldIndex, seed.worlds, 'world', ownerLabel);
        if (!worldIdsResponse.success || !worldIdsResponse.ids) {
            return { success: false, error: worldIdsResponse.error };
        }

        const worldIds = worldIdsResponse.ids;
        const locationIdsResponse = resolveReferencedIds(locationIndex, seed.locations, 'location', ownerLabel);
        if (!locationIdsResponse.success || !locationIdsResponse.ids) {
            return { success: false, error: locationIdsResponse.error };
        }

        const locationIds = locationIdsResponse.ids;
        const itemIdsResponse = resolveReferencedIds(itemIndex, seed.items, 'item', ownerLabel);
        if (!itemIdsResponse.success || !itemIdsResponse.ids) {
            return { success: false, error: itemIdsResponse.error };
        }

        const itemIds = itemIdsResponse.ids;

        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createAdventure.handle({
                name: seed.name,
                playableCharacterIds,
                aiControlledCharacterIds,
                worldMasterId,
                systemPromptIds,
                worldIds,
                locationIds,
                itemIds,
            });
            if (!response.success) {
                return { success: false, error: `Migration: failed to create adventure "${seed.name}": ${response.error}` };
            }
            continue;
        }

        const response = await editAdventure.handle({
            id: current.id,
            editParams: {
                name: current.name,
                playableCharacterIds,
                aiControlledCharacterIds,
                worldMasterId,
                characterAsWorldMasterId: undefined,
                systemPromptIds,
                worldIds,
                locationIds,
                itemIds,
            },
        });
        if (!response.success) {
            return { success: false, error: `Migration: failed to restore adventure "${seed.name}": ${response.error}` };
        }
    }

    return { success: true };
}
