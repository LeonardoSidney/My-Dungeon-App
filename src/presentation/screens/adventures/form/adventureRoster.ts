import { EntityOption } from '@domain/controllers';
import type { AdventureFormData } from './adventureForm';

type Roster = Pick<AdventureFormData, 'characters' | 'charactersControlledByAi' | 'characterAsWorldMasterId' | 'worldMaster'>;
export type RosterChange = Partial<Roster>;

function removeFromAllRoles (roster: Roster, id: string) {
    return {
        characters: roster.characters.filter(character => character.id !== id),
        charactersControlledByAi: roster.charactersControlledByAi.filter(existingId => existingId !== id),
        characterAsWorldMasterId: roster.characterAsWorldMasterId === id ? undefined : roster.characterAsWorldMasterId,
    };
}

function moveToEnd (characters: EntityOption[], id: string): EntityOption[] {
    const character = characters.find(entry => entry.id === id);
    if (!character) {
        return characters;
    }
    return [...characters.filter(entry => entry.id !== id), character];
}

export function togglePlayableCharacter (roster: Roster, character: EntityOption): RosterChange {
    const isPlayable = roster.characters.some(entry => entry.id === character.id);
    if (isPlayable) {
        return { characters: roster.characters.filter(entry => entry.id !== character.id) };
    }
    const cleaned = removeFromAllRoles(roster, character.id);
    return { ...cleaned, characters: [...cleaned.characters, character] };
}

export function toggleAiCharacter (roster: Roster, character: EntityOption): RosterChange {
    const isAiControlled = roster.charactersControlledByAi.includes(character.id);
    if (isAiControlled) {
        return { charactersControlledByAi: roster.charactersControlledByAi.filter(id => id !== character.id) };
    }
    const cleaned = removeFromAllRoles(roster, character.id);
    return { ...cleaned, charactersControlledByAi: [...cleaned.charactersControlledByAi, character.id] };
}

export function toggleCharacterAsWorldMaster (roster: Roster, character: EntityOption): RosterChange {
    const currentId = roster.characterAsWorldMasterId;
    if (currentId === character.id) {
        return { characterAsWorldMasterId: undefined, characters: moveToEnd(roster.characters, character.id) };
    }
    const cleaned = removeFromAllRoles(roster, character.id);
    return {
        characters: currentId ? moveToEnd(cleaned.characters, currentId) : cleaned.characters,
        charactersControlledByAi: cleaned.charactersControlledByAi,
        characterAsWorldMasterId: character.id,
        worldMaster: undefined,
    };
}

export function toggleWorldMaster (roster: Roster, worldMaster: EntityOption): RosterChange {
    if (roster.worldMaster?.id === worldMaster.id) {
        return { worldMaster: undefined };
    }
    if (roster.characterAsWorldMasterId) {
        return {
            characters: moveToEnd(roster.characters, roster.characterAsWorldMasterId),
            characterAsWorldMasterId: undefined,
            worldMaster,
        };
    }
    return { worldMaster };
}
