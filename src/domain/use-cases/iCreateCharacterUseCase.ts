import { Ability, Assistant, Attribute, Character, Proficiency, Status } from '../entities';

export interface ICreateCharacterUseCase {
    execute (params: CreateCharacterUseCasePrams): Promise<CreateCharacterUseCaseResponse>;
}

export type CreateCharacterUseCasePrams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    abilities?: Ability[];
    proficiencies?: Proficiency[];
    statuses?: Status[];
    attributes?: Attribute[];
    assistant: Assistant;
    worldMaster?: boolean;
};

export type CreateCharacterUseCaseResponse = {
    success: boolean;
    character?: Character;
    error?: string;
};
