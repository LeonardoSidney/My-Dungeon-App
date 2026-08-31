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
    const currentAssistant = findAssistantFromCharacter(assistants, character.assistantId);
    const currentAbilities = findAbilitiesFromCharacter(abilities, character.abilityIds || []);
    const currentProficiencies = findProficienciesFromCharacter(proficiencies, character.proficiencyIds || []);
    const currentStatuses = findStatusesFromCharacter(statuses, character.statusIds || []);
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
    assistantId: string
): Assistant | null {
    return assistants.find((a) => a.id === assistantId) ?? null;
}

function findAbilitiesFromCharacter (
    abilities: Ability[],
    abilityIds: string[]
): Ability[] {
    return abilities.filter((a) => abilityIds.includes(a.id));
}

function findProficienciesFromCharacter (
    proficiencies: Proficiency[],
    proficiencyIds: string[]
): Proficiency[] {
    return proficiencies.filter((p) => proficiencyIds.includes(p.id));
}

function findStatusesFromCharacter (
    statuses: Status[],
    statusIds: string[]
): Status[] {
    return statuses.filter((s) => statusIds.includes(s.id));
}

function findAttributesFromCharacter (
    characterAttributes: Attribute[]
): Attribute[] {
    return characterAttributes;
}
