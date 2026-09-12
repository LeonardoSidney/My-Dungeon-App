import { Status } from '@domain/entities';
import {
    CreateStatusControllerParams,
    EditStatusControllerParams,
    ICreateStatusController,
    IEditStatusController,
} from '@domain/controllers';
import {
    ActivationPromptFormData,
    ActivationPromptFormErrors,
} from '@application/ui/components';
import { ControllerResponse } from '@application/ui/hooks';

export function toFormState (status: Status): ActivationPromptFormData {
    return {
        id: status.id,
        name: status.name,
        activationWord: status.activationWord,
        prompt: status.prompt,
        observation: status.observation ?? '',
    };
}

export function initialStatusForm (): ActivationPromptFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}

export function toCreateParams (form: ActivationPromptFormData): CreateStatusControllerParams {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation,
    };
}

export function toEditParams (form: ActivationPromptFormData): EditStatusControllerParams {
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

export function validateStatusForm (form: ActivationPromptFormData): ActivationPromptFormErrors {
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

export function submitStatus (
    form: ActivationPromptFormData,
    createStatus: ICreateStatusController,
    editStatus: IEditStatusController
): Promise<ControllerResponse> {
    if (form.id) {
        return editStatus.handle(toEditParams(form));
    }
    return createStatus.handle(toCreateParams(form));
}
