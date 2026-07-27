import { Assistant, Ability, Proficiency, Status, Attribute } from '@domain/entities';

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
