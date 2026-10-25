import { ActivationPromptFormConfig } from '@presentation/components';
import { EntityOption, ModelOption } from '@domain/controllers';

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
    model: ModelOption | null;
    sampler: EntityOption | null;
};

export type FormErrors = {
    name?: string;
    model?: string;
    sampler?: string;
};
