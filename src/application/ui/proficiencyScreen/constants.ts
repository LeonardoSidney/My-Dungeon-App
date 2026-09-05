import {
    ActivationPromptFormData,
    ActivationPromptFormConfig,
    ActivationPromptFormErrors,
} from '@application/ui/components';

export const proficiencyFormConfig: ActivationPromptFormConfig = {
    entityName: 'Proficiency',
    activationLabel: 'Activation Word',
    namePlaceholder: 'e.g., Combat Mastery',
    activationPlaceholder: 'e.g., Combat',
    promptPlaceholder: 'Enter the proficiency prompt...',
};

export type ProficiencyFormData = ActivationPromptFormData;
export type FormErrors = ActivationPromptFormErrors;
