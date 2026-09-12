import { Item } from '@domain/entities';
import {
    CreateItemRequest,
    EditItemControllerParams,
    ICreateItemController,
    IEditItemController,
} from '@domain/controllers';
import {
    ActivationPromptFormData,
    ActivationPromptFormErrors,
} from '@application/ui/components';
import { ControllerResponse } from '@application/ui/hooks';

export function toFormState (item: Item): ActivationPromptFormData {
    return {
        id: item.id,
        name: item.name,
        activationWord: item.activationWord,
        prompt: item.prompt,
        observation: item.observation ?? '',
    };
}

export function initialItemForm (): ActivationPromptFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}

export function toCreateParams (form: ActivationPromptFormData): CreateItemRequest {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        activationWord: form.activationWord,
        prompt: form.prompt,
        observation,
    };
}

export function toEditParams (form: ActivationPromptFormData): EditItemControllerParams {
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

export function validateItemForm (form: ActivationPromptFormData): ActivationPromptFormErrors {
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

export function submitItem (
    form: ActivationPromptFormData,
    createItem: ICreateItemController,
    editItem: IEditItemController
): Promise<ControllerResponse> {
    if (form.id) {
        return editItem.handle(toEditParams(form));
    }
    return createItem.handle(toCreateParams(form));
}
