import { World } from '@domain/entities';
import {
    CreateWorldRequest,
    EditWorldControllerParams,
    ICreateWorldController,
    IEditWorldController,
} from '@domain/controllers';
import {
    ActivationPromptFormData,
    ActivationPromptFormErrors,
} from '@application/ui/components';
import { ControllerResponse } from '@application/ui/hooks';

export function toFormState (world: World): ActivationPromptFormData {
    return {
        id: world.id,
        name: world.name,
        activationWord: world.activationWord,
        prompt: world.prompt,
        observation: world.observation ?? '',
    };
}

export function initialWorldForm (): ActivationPromptFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}

export function toCreateParams (form: ActivationPromptFormData): CreateWorldRequest {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation,
    };
}

export function toEditParams (form: ActivationPromptFormData): EditWorldControllerParams {
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

export function validateWorldForm (form: ActivationPromptFormData): ActivationPromptFormErrors {
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

export function submitWorld (
    form: ActivationPromptFormData,
    createWorld: ICreateWorldController,
    editWorld: IEditWorldController
): Promise<ControllerResponse> {
    if (form.id) {
        return editWorld.handle(toEditParams(form));
    }
    return createWorld.handle(toCreateParams(form));
}
