import { ActivationPromptFormConfig } from '@application/ui/components';
import { Assistant, Ability, Proficiency, Status, Attribute } from '@domain/entities';

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
    assistant: Assistant | null;
    abilities: Ability[];
    proficiencies: Proficiency[];
    statuses: Status[];
    attributes: Attribute[];
};
