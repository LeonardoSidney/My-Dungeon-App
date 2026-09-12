import { Assistant, Model, Sampler } from '@domain/entities';
import {
    CreateAssistantControllerParams,
    EditAssistantControllerParams,
    ICreateAssistantController,
    IEditAssistantController,
} from '@domain/controllers';
import { ControllerResponse } from '@application/ui/hooks';
import { AssistantFormData, FormErrors } from './constants';

export function toAssistantFormState (
    assistant: Assistant,
    models: Model[],
    samplers: Sampler[]
): AssistantFormData {
    const currentModel = models.find(
        (m) => m.id === assistant.modelId && m.connectionId === assistant.connectionId
    ) ?? null;
    const currentSampler = samplers.find((s) => s.id === assistant.samplerId) ?? null;

    return {
        id: assistant.id,
        name: assistant.name,
        activationWord: '',
        prompt: '',
        observation: assistant.observation || '',
        model: currentModel,
        sampler: currentSampler,
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

export function toCreateParams (
    form: AssistantFormData,
    model: Model,
    sampler: Sampler
): CreateAssistantControllerParams {
    const observation = form.observation || undefined;
    return {
        name: form.name,
        observation,
        modelId: model.id,
        connectionId: model.connectionId,
        samplerId: sampler.id,
    };
}

export function toEditParams (
    form: AssistantFormData,
    model: Model,
    sampler: Sampler
): EditAssistantControllerParams {
    const observation = form.observation || undefined;
    return {
        id: form.id,
        editParams: {
            name: form.name,
            observation,
            modelId: model.id,
            connectionId: model.connectionId,
            samplerId: sampler.id,
        },
    };
}

export function validateAssistantForm (form: AssistantFormData): FormErrors {
    const errors: FormErrors = {};
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
    editAssistant: IEditAssistantController
): Promise<ControllerResponse> {
    if (!form.model) {
        return Promise.resolve({ success: false, error: 'Model is required' });
    }
    if (!form.sampler) {
        return Promise.resolve({ success: false, error: 'Sampler is required' });
    }
    if (form.id) {
        return editAssistant.handle(toEditParams(form, form.model, form.sampler));
    }
    return createAssistant.handle(toCreateParams(form, form.model, form.sampler));
}
