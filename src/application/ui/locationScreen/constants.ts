import {
    ActivationPromptFormData,
    ActivationPromptFormConfig,
    ActivationPromptFormErrors,
} from '@application/ui/components';

export const locationFormConfig: ActivationPromptFormConfig = {
    entityName: 'Location',
    activationLabel: 'Activation Word',
    namePlaceholder: 'e.g., Ancient Ruins',
    activationPlaceholder: 'e.g., ruins;temple',
    promptPlaceholder: 'Enter the location prompt...',
};

export type LocationFormData = ActivationPromptFormData;
export type FormErrors = ActivationPromptFormErrors;
