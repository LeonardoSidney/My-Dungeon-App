import { Dispatch, SetStateAction } from 'react';
import { Assistant, Model, Sampler } from '@domain/entities';
import { AssistantFormData } from './constants';

export function onEditForm (
    assistant: Assistant,
    models: Model[],
    samplers: Sampler[],
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAssistantFormData: Dispatch<SetStateAction<AssistantFormData>>
) {
    const currentModel = findModelFromAssistant(models, assistant.model);
    const currentSampler = findSamplerFromAssistant(samplers, assistant.sampler);

    setAssistantFormData({
        id: assistant.id,
        name: assistant.name,
        observation: assistant.observation || '',
        model: currentModel,
        sampler: currentSampler,
        createdAt: assistant.createdAt,
        updatedAt: assistant.updatedAt,
    });
    setShowForm(true);
}

function findSamplerFromAssistant (
    samplers: Sampler[],
    assistantSampler: Sampler
): Sampler | null {
    return samplers.find((s) => s.id === assistantSampler.id) ?? null;
}

function findModelFromAssistant (
    models: Model[],
    assistantModel: Model
): Model | null {
    return models.find(
        (m) => m.id === assistantModel.id && m.connection.id === assistantModel.connection.id
    ) ?? null;
}
