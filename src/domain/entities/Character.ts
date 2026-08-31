import { Attribute } from './Attribute';

export type Character = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    abilityIds?: string[];
    proficiencyIds?: string[];
    statusIds?: string[];
    attributes?: Attribute[];
    assistantId: string;
    createdAt: Date;
    updatedAt: Date;
};
