import { Character, Assistant, Ability, Proficiency, Status } from '@domain/entities';
import {
    CreateCharacterControllerPrams,
    EditCharacterControllerParams,
    ICreateCharacterController,
    IEditCharacterController,
} from '@domain/controllers';
import { CharacterFormData, FormErrors } from './constants';
import { ControllerResponse } from '@application/ui/hooks';
import { filterAttributes } from './filterAttributes';

export function toCharacterFormState (
    character: Character,
    assistants: Assistant[],
    abilities: Ability[],
    proficiencies: Proficiency[],
    statuses: Status[]
): CharacterFormData {
    return {
        id: character.id,
        name: character.name,
        activationWord: character.activationWord,
        prompt: character.prompt,
        observation: character.observation ?? '',
        assistant: assistants.find(assistant => assistant.id === character.assistantId) ?? null,
        abilities: abilities.filter(ability => (character.abilityIds ?? []).includes(ability.id)),
        proficiencies: proficiencies.filter(proficiency => (character.proficiencyIds ?? []).includes(proficiency.id)),
        statuses: statuses.filter(status => (character.statusIds ?? []).includes(status.id)),
        attributes: character.attributes ?? [],
    };
}

export function initialCharacterForm (): CharacterFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
        assistant: null,
        abilities: [],
        proficiencies: [],
        statuses: [],
        attributes: [],
    };
}

export function toggleListItem<T extends { id: string; }> (current: T[], item: T): T[] {
    const isSelected = current.some(existing => existing.id === item.id);
    if (isSelected) {
        return current.filter(existing => existing.id !== item.id);
    }
    return [...current, item];
}

export function toCreateParams (form: CharacterFormData): CreateCharacterControllerPrams {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation,
        assistantId: form.assistant?.id ?? '',
        abilityIds: form.abilities.map(ability => ability.id),
        proficiencyIds: form.proficiencies.map(proficiency => proficiency.id),
        statusIds: form.statuses.map(status => status.id),
        attributes: filterAttributes(form.attributes),
    };
}

export function toEditParams (form: CharacterFormData): EditCharacterControllerParams {
    const observation = form.observation || undefined;
    return {
        id: form.id,
        editParams: {
            name: form.name,
            activationWord: form.activationWord,
            prompt: form.prompt,
            observation,
            assistantId: form.assistant?.id ?? '',
            abilityIds: form.abilities.map(ability => ability.id),
            proficiencyIds: form.proficiencies.map(proficiency => proficiency.id),
            statusIds: form.statuses.map(status => status.id),
            attributes: filterAttributes(form.attributes),
        },
    };
}

export function validateCharacterForm (form: CharacterFormData): FormErrors {
    const errors: FormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!form.activationWord.trim()) {
        errors.activationWord = 'Activation Word is required';
    }
    if (!form.assistant) {
        errors.assistant = 'Assistant is required';
    }
    if (!form.prompt.trim()) {
        errors.prompt = 'Prompt is required';
    }
    return errors;
}

export function submitCharacter (
    form: CharacterFormData,
    createCharacter: ICreateCharacterController,
    editCharacter: IEditCharacterController
): Promise<ControllerResponse> {
    if (!form.assistant) {
        return Promise.resolve({ success: false, error: 'Assistant is required' });
    }
    if (form.id) {
        return editCharacter.handle(toEditParams(form));
    }
    return createCharacter.handle(toCreateParams(form));
}
