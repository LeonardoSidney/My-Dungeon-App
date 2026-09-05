import {
    ActivationPromptFormData,
    ActivationPromptFormConfig,
    ActivationPromptFormErrors,
} from '@application/ui/components';

export const statusFormConfig: ActivationPromptFormConfig = {
    entityName: 'Status',
    activationLabel: 'Activation Word',
    namePlaceholder: 'e.g., Blessing',
    activationPlaceholder: 'e.g., blessing;holy',
    promptPlaceholder: 'Enter the status prompt...',
};

export type StatusFormData = ActivationPromptFormData;
export type FormErrors = ActivationPromptFormErrors;

