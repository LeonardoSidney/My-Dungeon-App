import { Ability, Assistant, Attribute, Character, Proficiency, Status } from '../entities';

export interface ICreateCharacterService {
    createCharacter(params: CreateCharacterServiceParams): CreateCharacterServiceResponse;
}

export type CreateCharacterServiceParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    abilities?: Ability[];
    proficiencies?: Proficiency[];
    statuses?: Status[];
    attributes?: Attribute[];
    assistant: Assistant;
};

export type CreateCharacterServiceResponse = {
    success: boolean;
    character?: Character,
    error?: string;
};
