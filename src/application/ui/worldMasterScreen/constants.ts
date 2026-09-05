import { ActivationPromptFormConfig } from '@application/ui/components';
import { Assistant } from '@domain/entities';

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
    assistant: Assistant | null;
};

export type FormErrors = {
    name?: string;
    activationWord?: string;
    assistant?: string;
    prompt?: string;
};

export function setInitialWorldMasterState (): WorldMasterFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
        assistant: null,
    };
}
