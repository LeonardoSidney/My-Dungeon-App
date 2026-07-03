import { Ability, Assistant, Attribute, Character, Proficiency, Status } from '../entities';

export interface ICreateCharacterController {
    handle(params: CreateCharacterControllerPrams): Promise<CreateCharacterControllerResponse>;
}

export type CreateCharacterControllerPrams = {
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

export type CreateCharacterControllerResponse = {
    success: boolean;
    character?: Character;
    error?: string;
};
