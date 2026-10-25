import { ActivationPromptFormConfig } from '@presentation/components';
import { EntityOption } from '@domain/controllers';

export const worldMasterFormConfig: ActivationPromptFormConfig = {
    entityName: 'World Master',
    activationLabel: 'Activation Word',
    namePlaceholder: 'e.g., Dungeon Master',
    activationPlaceholder: 'e.g., Dungeon',
    promptPlaceholder: 'Enter the world master prompt...',
};

export type WorldMasterFormData = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    assistant: EntityOption | null;
};

export type FormErrors = {
    name?: string;
    activationWord?: string;
    assistant?: string;
    prompt?: string;
};
