import { Ability } from '@domain/entities';
import {
    CreateAbilityControllerParams,
    EditAbilityControllerParams,
    ICreateAbilityController,
    IEditAbilityController,
} from '@domain/controllers';
import {
    ActivationPromptFormData,
    ActivationPromptFormErrors,
} from '@application/ui/components';
import { ControllerResponse } from '@application/ui/hooks';

export function toFormState (ability: Ability): ActivationPromptFormData {
    return {
        id: ability.id,
        name: ability.name,
        activationWord: ability.activationWord,
        prompt: ability.prompt,
        observation: ability.observation ?? '',
    };
}

export function initialAbilityForm (): ActivationPromptFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}

export function toCreateParams (form: ActivationPromptFormData): CreateAbilityControllerParams {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation,
    };
}

export function toEditParams (form: ActivationPromptFormData): EditAbilityControllerParams {
    const observation = form.observation || undefined;
    return {
        id: form.id,
        editParams: {
            name: form.name,
            activationWord: form.activationWord,
            prompt: form.prompt,
            observation,
        },
    };
}

export function validateAbilityForm (form: ActivationPromptFormData): ActivationPromptFormErrors {
    const errors: ActivationPromptFormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!form.activationWord.trim()) {
        errors.activationWord = 'Activation Word is required';
    }
    if (!form.prompt.trim()) {
        errors.prompt = 'Prompt is required';
    }
    return errors;
}

export function submitAbility (
    form: ActivationPromptFormData,
    createAbility: ICreateAbilityController,
    editAbility: IEditAbilityController,
): Promise<ControllerResponse> {
    if (form.id) {
        return editAbility.handle(toEditParams(form));
    }
    return createAbility.handle(toCreateParams(form));
}
