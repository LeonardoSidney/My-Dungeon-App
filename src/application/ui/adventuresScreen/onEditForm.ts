import { Dispatch, SetStateAction } from 'react';
import { Adventure } from '@domain/entities';
import { AdventureFormData } from './constants';

export function onEditForm(
    adventure: Adventure,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAdventureFormData: Dispatch<SetStateAction<AdventureFormData>>
) {
    const characterAsWorldMaster = adventure.characters.find(
        c => c.worldMaster === true
    );

    setAdventureFormData({
        id: adventure.id,
        name: adventure.name,
        systemPrompts: adventure.systemPrompts,
        characters: adventure.characters,
        worldMaster: adventure.worldMaster,
        characterAsWorldMasterId: characterAsWorldMaster?.id,
        avaliableCharacters: adventure.characters,
        worlds: adventure.worlds,
        locations: adventure.locations,
        items: adventure.items,
        chat: adventure.chat,
    });
    setShowForm(true);
}
