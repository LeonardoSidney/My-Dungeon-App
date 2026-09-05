import {
    ActivationPromptFormData,
    ActivationPromptFormConfig,
    ActivationPromptFormErrors,
} from '@application/ui/components';

export const worldFormConfig: ActivationPromptFormConfig = {
    entityName: 'World',
    activationLabel: 'Activation Word',
    namePlaceholder: 'e.g., Fantasy World',
    activationPlaceholder: 'e.g., Dungeon',
    promptPlaceholder: 'Enter the world prompt...',
};

export type WorldFormData = ActivationPromptFormData;
export type FormErrors = ActivationPromptFormErrors;

export function setInitialWorldState (): WorldFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}
