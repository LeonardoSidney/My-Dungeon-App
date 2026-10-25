import {
    AssistantDetails,
    CreateAssistantControllerParams,
    EntityOption,
    ModelOption,
    ICreateAssistantController,
    IEditAssistantController,
} from '@domain/controllers';
import { ControllerResponse } from '@presentation/hooks';

export type AssistantFormData = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    model: ModelOption | null;
    sampler: EntityOption | null;
};

export type AssistantFormErrors = {
    name?: string;
    model?: string;
    sampler?: string;
};

export function modelKey (model: Pick<ModelOption, 'id' | 'connectionId'>): string {
    return `${model.id}-${model.connectionId}`;
}

export function toAssistantFormState (
    assistant: AssistantDetails,
    models: ModelOption[],
    samplers: EntityOption[],
): AssistantFormData {
    return {
        id: assistant.id,
        name: assistant.name,
        activationWord: '',
        prompt: '',
        observation: assistant.observation || '',
        model: models.find(model => model.id === assistant.modelId && model.connectionId === assistant.connectionId) ?? null,
        sampler: samplers.find(sampler => sampler.id === assistant.samplerId) ?? null,
    };
}

export function initialAssistantForm (): AssistantFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
        model: null,
        sampler: null,
    };
}

function toAssistantRequest (form: AssistantFormData, model: ModelOption, sampler: EntityOption): CreateAssistantControllerParams {
    return {
        name: form.name,
        observation: form.observation || undefined,
        modelId: model.id,
        connectionId: model.connectionId,
        samplerId: sampler.id,
    };
}

export function validateAssistantForm (form: AssistantFormData): AssistantFormErrors {
    const errors: AssistantFormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!form.model) {
        errors.model = 'Model is required';
    }
    if (!form.sampler) {
        errors.sampler = 'Sampler is required';
    }
    return errors;
}

export function submitAssistant (
    form: AssistantFormData,
    createAssistant: ICreateAssistantController,
    editAssistant: IEditAssistantController,
): Promise<ControllerResponse> {
    if (!form.model) {
        return Promise.resolve({ success: false, error: 'Model is required' });
    }
    if (!form.sampler) {
        return Promise.resolve({ success: false, error: 'Sampler is required' });
    }
    const request = toAssistantRequest(form, form.model, form.sampler);
    if (form.id) {
        return editAssistant.handle({ id: form.id, editParams: request });
    }
    return createAssistant.handle(request);
}
