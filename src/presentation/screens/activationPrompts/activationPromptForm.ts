import {
    ActivationPromptDetails,
    ActivationPromptListItem,
    DetailControllerResponse,
    GetByIdControllerParams,
    ListControllerResponse,
    MutationControllerResponse,
} from '@domain/controllers';
import { ActivationPromptFormData, ActivationPromptFormErrors } from '@presentation/components';
import { ControllerResponse } from '@presentation/hooks';

export type ActivationPromptRequest = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type ActivationPromptControllers = {
    list: { handle: () => Promise<ListControllerResponse<ActivationPromptListItem>>; };
    get: { handle: (params: GetByIdControllerParams) => Promise<DetailControllerResponse<ActivationPromptDetails>>; };
    create: { handle: (params: ActivationPromptRequest) => Promise<MutationControllerResponse>; };
    edit: { handle: (params: { id: string; editParams: ActivationPromptRequest; }) => Promise<MutationControllerResponse>; };
    erase: { handle: (params: GetByIdControllerParams) => Promise<ControllerResponse>; };
};

export function toFormState (entity: ActivationPromptDetails): ActivationPromptFormData {
    return {
        id: entity.id,
        name: entity.name,
        activationWord: entity.activationWord,
        prompt: entity.prompt,
        observation: entity.observation ?? '',
    };
}

export function initialActivationPromptForm (): ActivationPromptFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}

export function toCreateParams (form: ActivationPromptFormData): ActivationPromptRequest {
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation: form.observation || undefined,
    };
}

export function toEditParams (form: ActivationPromptFormData): { id: string; editParams: ActivationPromptRequest; } {
    return {
        id: form.id,
        editParams: toCreateParams(form),
    };
}

export function validateActivationPromptForm (form: ActivationPromptFormData): ActivationPromptFormErrors {
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

export function submitActivationPrompt (
    form: ActivationPromptFormData,
    controllers: Pick<ActivationPromptControllers, 'create' | 'edit'>,
): Promise<ControllerResponse> {
    if (form.id) {
        return controllers.edit.handle(toEditParams(form));
    }
    return controllers.create.handle(toCreateParams(form));
}
