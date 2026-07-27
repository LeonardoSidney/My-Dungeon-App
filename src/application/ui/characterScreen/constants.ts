import { Assistant, Ability, Proficiency, Status, Attribute } from '@domain/entities';

export type FormErrors = {
    name?: string;
    activationWord?: string;
    assistant?: string;
    prompt?: string;
};

export type CharacterFormData = {
    id?: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    assistant: Assistant | null;
    abilities: Ability[];
    proficiencies: Proficiency[];
    statuses: Status[];
    attributes: Attribute[];
    createdAt?: Date;
    updatedAt?: Date;
};
