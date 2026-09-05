import {
    ActivationPromptFormData,
    ActivationPromptFormConfig,
    ActivationPromptFormErrors,
} from '@application/ui/components';

export const abilityFormConfig: ActivationPromptFormConfig = {
    entityName: 'Ability',
    activationLabel: 'Activation Word',
    namePlaceholder: 'e.g., Fireball',
    activationPlaceholder: 'e.g., Combat',
    promptPlaceholder: 'Enter the ability prompt...',
};

export type AbilityFormData = ActivationPromptFormData;
export type FormErrors = ActivationPromptFormErrors;
