import {
    CreateSystemPromptRequest,
    ICreateSystemPromptController,
    IEditSystemPromptController,
    SystemPromptDetails,
} from '@domain/controllers';
import { ControllerResponse } from '@presentation/hooks';

export type SystemPromptFormData = {
    id: string;
    name: string;
    content: string;
    observation: string;
};

export type SystemPromptFormErrors = {
    name?: string;
    content?: string;
};

export function toSystemPromptFormState (systemPrompt: SystemPromptDetails): SystemPromptFormData {
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

function toSystemPromptRequest (form: SystemPromptFormData): CreateSystemPromptRequest {
    return {
        name: form.name,
        content: form.content,
        observation: form.observation || undefined,
    };
}

export function validateSystemPromptForm (form: SystemPromptFormData): SystemPromptFormErrors {
    const errors: SystemPromptFormErrors = {};
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
    editSystemPrompt: IEditSystemPromptController,
): Promise<ControllerResponse> {
    if (form.id) {
        return editSystemPrompt.handle({ id: form.id, editParams: toSystemPromptRequest(form) });
    }
    return createSystemPrompt.handle(toSystemPromptRequest(form));
}
