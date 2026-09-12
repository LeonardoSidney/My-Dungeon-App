import { Location } from '@domain/entities';
import {
    CreateLocationRequest,
    EditLocationControllerParams,
    ICreateLocationController,
    IEditLocationController,
} from '@domain/controllers';
import {
    ActivationPromptFormData,
    ActivationPromptFormErrors,
} from '@application/ui/components';
import { ControllerResponse } from '@application/ui/hooks';

export function toFormState (location: Location): ActivationPromptFormData {
    return {
        id: location.id,
        name: location.name,
        activationWord: location.activationWord,
        prompt: location.prompt,
        observation: location.observation ?? '',
    };
}

export function initialLocationForm (): ActivationPromptFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}

export function toCreateParams (form: ActivationPromptFormData): CreateLocationRequest {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation,
    };
}

export function toEditParams (form: ActivationPromptFormData): EditLocationControllerParams {
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

export function validateLocationForm (form: ActivationPromptFormData): ActivationPromptFormErrors {
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

export function submitLocation (
    form: ActivationPromptFormData,
    createLocation: ICreateLocationController,
    editLocation: IEditLocationController
): Promise<ControllerResponse> {
    if (form.id) {
        return editLocation.handle(toEditParams(form));
    }
    return createLocation.handle(toCreateParams(form));
}
