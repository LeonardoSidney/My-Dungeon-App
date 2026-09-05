import {
    createAdventureController,
    editAdventureController,
    getAdventuresController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { Character, Item, Location, SystemPrompt, World, WorldMaster } from '@domain/entities';
import { SeedAdventure } from './types';
import { nameIndex, resolveReferencedIds } from './shared';

export async function seedAdventures (
    seeds: SeedAdventure[],
    characters: Character[],
    worldMasters: WorldMaster[],
    systemPrompts: SystemPrompt[],
    worlds: World[],
    locations: Location[],
    items: Item[]
): Promise<void> {
    const createAdventure = createAdventureController();
    const editAdventure = editAdventureController();
    const getAdventures = getAdventuresController();
    const existing = await getAdventures.handle();
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
        const worldMasterIds = seed.worldMaster
            ? resolveReferencedIds(worldMasterIndex, [seed.worldMaster], 'world master', ownerLabel)
            : [];
        const worldMasterId = worldMasterIds[0];

        const characterIds = resolveReferencedIds(characterIndex, seed.characters, 'character', ownerLabel);
        const charactersControlledByAi = resolveReferencedIds(characterIndex, seed.charactersControlledByAi, 'character', ownerLabel);
        const systemPromptIds = resolveReferencedIds(systemPromptIndex, seed.systemPrompts, 'system prompt', ownerLabel);
        const worldIds = resolveReferencedIds(worldIndex, seed.worlds, 'world', ownerLabel);
        const locationIds = resolveReferencedIds(locationIndex, seed.locations, 'location', ownerLabel);
        const itemIds = resolveReferencedIds(itemIndex, seed.items, 'item', ownerLabel);

        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createAdventure.handle({
                name: seed.name,
                characterIds,
                worldMasterId,
                systemPromptIds,
                worldIds,
                locationIds,
                itemIds,
                charactersControlledByAi,
            });
            if (!response.success) {
                throw new Error(`Migration: failed to create adventure "${seed.name}": ${response.error}`);
            }
            continue;
        }

        const response = await editAdventure.handle({
            id: current.id,
            editParams: {
                name: current.name,
                chat: current.chat,
                characterIds,
                worldMasterId,
                characterAsWorldMasterId: current.characterAsWorldMasterId,
                systemPromptIds,
                worldIds,
                locationIds,
                itemIds,
                charactersControlledByAi,
            },
        });
        if (!response.success) {
            throw new Error(`Migration: failed to restore adventure "${seed.name}": ${response.error}`);
        }
    }
}
