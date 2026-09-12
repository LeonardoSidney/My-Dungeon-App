import { SystemPrompt } from '@domain/entities';
import {
    CreateSystemPromptRequest,
    EditSystemPromptControllerParams,
    ICreateSystemPromptController,
    IEditSystemPromptController,
} from '@domain/controllers';
import { SystemPromptFormData, FormErrors } from './constants';
import { ControllerResponse } from '@application/ui/hooks';

export function toSystemPromptFormState (systemPrompt: SystemPrompt): SystemPromptFormData {
    return {
        id: systemPrompt.id,
        name: systemPrompt.name,
        content: systemPrompt.content,
        observation: systemPrompt.observation ?? '',
    };
}

export function initialSystemPromptForm (): SystemPromptFormData {
    return {
        id: '',
        name: '',
        content: '',
        observation: '',
    };
}

export function toCreateParams (form: SystemPromptFormData): CreateSystemPromptRequest {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        content: form.content,
        observation,
    };
}

export function toEditParams (form: SystemPromptFormData): EditSystemPromptControllerParams {
    const observation = form.observation || undefined;
    return {
        id: form.id,
        editParams: {
            name: form.name,
            content: form.content,
            observation,
        },
    };
}

export function validateSystemPromptForm (form: SystemPromptFormData): FormErrors {
    const errors: FormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!form.content.trim()) {
        errors.content = 'Content is required';
    }
    return errors;
}

export function submitSystemPrompt (
    form: SystemPromptFormData,
    createSystemPrompt: ICreateSystemPromptController,
    editSystemPrompt: IEditSystemPromptController
): Promise<ControllerResponse> {
    if (form.id) {
        return editSystemPrompt.handle(toEditParams(form));
    }
    return createSystemPrompt.handle(toCreateParams(form));
}
