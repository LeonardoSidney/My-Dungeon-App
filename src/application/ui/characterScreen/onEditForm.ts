import { Dispatch, SetStateAction } from 'react';
import { Character, Assistant, Ability, Proficiency, Status, Attribute } from '@domain/entities';
import { CharacterFormData } from './constants';

export function onEditForm (
    character: Character,
    assistants: Assistant[],
    abilities: Ability[],
    proficiencies: Proficiency[],
    statuses: Status[],
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setCharacterFormData: Dispatch<SetStateAction<CharacterFormData>>
) {
    const currentAssistant = findAssistantFromCharacter(assistants, character.assistant);
    const currentAbilities = findAbilitiesFromCharacter(abilities, character.abilities || []);
    const currentProficiencies = findProficienciesFromCharacter(proficiencies, character.proficiencies || []);
    const currentStatuses = findStatusesFromCharacter(statuses, character.statuses || []);
    const currentAttributes = findAttributesFromCharacter(character.attributes || []);

    setCharacterFormData({
        id: character.id,
        name: character.name,
        activationWord: character.activationWord,
        prompt: character.prompt,
        observation: character.observation || '',
        assistant: currentAssistant,
        abilities: currentAbilities,
        proficiencies: currentProficiencies,
        statuses: currentStatuses,
        attributes: currentAttributes,
        createdAt: character.createdAt,
        updatedAt: character.updatedAt,
    });
    setShowForm(true);
}

function findAssistantFromCharacter (
    assistants: Assistant[],
    characterAssistant: Assistant
): Assistant | null {
    return assistants.find((a) => a.id === characterAssistant.id) ?? null;
}

function findAbilitiesFromCharacter (
    abilities: Ability[],
    characterAbilities: Ability[]
): Ability[] {
    return abilities.filter((a) => characterAbilities.some((ca) => ca.id === a.id));
}

function findProficienciesFromCharacter (
    proficiencies: Proficiency[],
    characterProficiencies: Proficiency[]
): Proficiency[] {
    return proficiencies.filter((p) => characterProficiencies.some((cp) => cp.id === p.id));
}

function findStatusesFromCharacter (
    statuses: Status[],
    characterStatuses: Status[]
): Status[] {
    return statuses.filter((s) => characterStatuses.some((cs) => cs.id === s.id));
}

function findAttributesFromCharacter (
    characterAttributes: Attribute[]
): Attribute[] {
    return characterAttributes;
}
