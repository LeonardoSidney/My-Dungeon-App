import {
    CharacterDetails,
    EntityOption,
    CreateCharacterControllerPrams,
    EditCharacterControllerParams,
    ICreateCharacterController,
    IEditCharacterController,
} from '@domain/controllers';
import { Attribute } from '@domain/entities';
import { ControllerResponse } from '@presentation/hooks';

export type CharacterFormData = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    assistant: EntityOption | null;
    abilities: EntityOption[];
    proficiencies: EntityOption[];
    statuses: EntityOption[];
    attributes: Attribute[];
};

export type CharacterFormErrors = {
    name?: string;
    activationWord?: string;
    assistant?: string;
    prompt?: string;
};

export type CharacterFormOptions = {
    assistants: EntityOption[];
    abilities: EntityOption[];
    proficiencies: EntityOption[];
    statuses: EntityOption[];
};

export function toCharacterFormState (character: CharacterDetails, options: CharacterFormOptions): CharacterFormData {
    return {
        id: character.id,
        name: character.name,
        activationWord: character.activationWord,
        prompt: character.prompt,
        observation: character.observation ?? '',
        assistant: options.assistants.find(assistant => assistant.id === character.assistantId) ?? null,
        abilities: options.abilities.filter(ability => character.abilityIds.includes(ability.id)),
        proficiencies: options.proficiencies.filter(proficiency => character.proficiencyIds.includes(proficiency.id)),
        statuses: options.statuses.filter(status => character.statusIds.includes(status.id)),
        attributes: character.attributes,
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

function toCharacterRequest (form: CharacterFormData, assistantId: string): CreateCharacterControllerPrams {
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation: form.observation || undefined,
        assistantId,
        abilityIds: form.abilities.map(ability => ability.id),
        proficiencyIds: form.proficiencies.map(proficiency => proficiency.id),
        statusIds: form.statuses.map(status => status.id),
        attributes: form.attributes.filter(attribute => attribute.name.trim() !== ''),
    };
}

export function validateCharacterForm (form: CharacterFormData): CharacterFormErrors {
    const errors: CharacterFormErrors = {};
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
    editCharacter: IEditCharacterController,
): Promise<ControllerResponse> {
    if (!form.assistant) {
        return Promise.resolve({ success: false, error: 'Assistant is required' });
    }
    const request = toCharacterRequest(form, form.assistant.id);
    if (form.id) {
        const params: EditCharacterControllerParams = { id: form.id, editParams: request };
        return editCharacter.handle(params);
    }
    return createCharacter.handle(request);
}
