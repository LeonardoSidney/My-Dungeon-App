import { ActivationPromptFormConfig } from '@application/ui/components';
import { Attribute } from '@domain/entities';
import { EntityOption } from '@domain/controllers';

export const characterFormConfig: ActivationPromptFormConfig = {
    entityName: 'Character',
    activationLabel: 'Activation Word',
    namePlaceholder: 'e.g., NPC Merchant',
    activationPlaceholder: 'e.g., Merchant',
    promptPlaceholder: 'Enter the character prompt...',
};

export type FormErrors = {
    name?: string;
    activationWord?: string;
    assistant?: string;
    prompt?: string;
};

export type CharacterFormData = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    assistant: EntityOption | null;
    abilities: EntityOption[];
    proficiencies: EntityOption[];
    statuses: EntityOption[];
    attributes: Attribute[];
};
