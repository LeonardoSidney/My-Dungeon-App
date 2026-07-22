import { Assistant, Ability, Proficiency, Status, Attribute } from '@domain/entities';

export type CharacterFormData = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistant: Assistant;
    abilities: Ability[];
    proficiencies: Proficiency[];
    statuses: Status[];
    attributes: Attribute[];
    worldMaster?: boolean;
};
