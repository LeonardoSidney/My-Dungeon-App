import { ActivationPromptFormConfig } from '@application/ui/components';
import { Model, Sampler } from '@domain/entities';

export const assistantFormConfig: ActivationPromptFormConfig = {
    entityName: 'Assistant',
    namePlaceholder: 'e.g., Dungeon Master Assistant',
};

export type AssistantFormData = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    model: Model | null;
    sampler: Sampler | null;
};

export type FormErrors = {
    name?: string;
    model?: string;
    sampler?: string;
};

export function setInitialAssistantState (): AssistantFormData {
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
