import {
    ActivationPromptFormData,
    ActivationPromptFormConfig,
    ActivationPromptFormErrors,
} from '@application/ui/components';

export const itemFormConfig: ActivationPromptFormConfig = {
    entityName: 'Item',
    activationLabel: 'Activation Word',
    namePlaceholder: 'e.g., Iron Sword',
    activationPlaceholder: 'e.g., sword;blade',
    promptPlaceholder: 'Enter the item prompt...',
};

export type ItemFormData = ActivationPromptFormData;
export type FormErrors = ActivationPromptFormErrors;
