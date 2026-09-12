import { Proficiency } from '@domain/entities';
import {
    CreateProficiencyControllerParams,
    EditProficiencyControllerParams,
    ICreateProficiencyController,
    IEditProficiencyController,
} from '@domain/controllers';
import {
    ActivationPromptFormData,
    ActivationPromptFormErrors,
} from '@application/ui/components';
import { ControllerResponse } from '@application/ui/hooks';

export function toFormState (proficiency: Proficiency): ActivationPromptFormData {
    return {
        id: proficiency.id,
        name: proficiency.name,
        activationWord: proficiency.activationWord,
        prompt: proficiency.prompt,
        observation: proficiency.observation ?? '',
    };
}

export function initialProficiencyForm (): ActivationPromptFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}

export function toCreateParams (form: ActivationPromptFormData): CreateProficiencyControllerParams {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation,
    };
}

export function toEditParams (form: ActivationPromptFormData): EditProficiencyControllerParams {
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

export function validateProficiencyForm (form: ActivationPromptFormData): ActivationPromptFormErrors {
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

export function submitProficiency (
    form: ActivationPromptFormData,
    createProficiency: ICreateProficiencyController,
    editProficiency: IEditProficiencyController
): Promise<ControllerResponse> {
    if (form.id) {
        return editProficiency.handle(toEditParams(form));
    }
    return createProficiency.handle(toCreateParams(form));
}
