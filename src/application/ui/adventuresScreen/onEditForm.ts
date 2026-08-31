import { Dispatch, SetStateAction } from 'react';
import { Adventure, Character, SystemPrompt, WorldMaster, World, Location, Item } from '@domain/entities';
import { AdventureFormData } from './constants';

export function onEditForm (
    adventure: Adventure,
    characters: Character[],
    systemPrompts: SystemPrompt[],
    worldMasters: WorldMaster[],
    worlds: World[],
    locations: Location[],
    items: Item[],
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAdventureFormData: Dispatch<SetStateAction<AdventureFormData>>
) {
    const selectedSystemPrompts = systemPrompts.filter(sp => adventure.systemPromptIds.includes(sp.id));

    const selectedCharacters = characters.filter(c => adventure.characterIds.includes(c.id));

    const selectedWorldMaster = adventure.worldMasterId
        ? worldMasters.find(wm => wm.id === adventure.worldMasterId)
        : undefined;

    const selectedWorlds = worlds.filter(w => adventure.worldIds.includes(w.id));
    const selectedLocations = locations.filter(l => adventure.locationIds.includes(l.id));
    const selectedItems = items.filter(i => adventure.itemIds.includes(i.id));

    setAdventureFormData({
        id: adventure.id,
        name: adventure.name,
        systemPrompts: selectedSystemPrompts,
        characters: selectedCharacters,
        worldMaster: selectedWorldMaster,
        characterAsWorldMasterId: adventure.characterAsWorldMasterId,
        charactersControlledByAi: adventure.charactersControlledByAi,
        avaliableCharacters: characters,
        worlds: selectedWorlds,
        locations: selectedLocations,
        items: selectedItems,
        chat: adventure.chat,
        createdAt: adventure.createdAt,
    });
    setShowForm(true);
}
