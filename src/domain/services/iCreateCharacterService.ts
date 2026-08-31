import { Attribute, Character } from '../entities';

export interface ICreateCharacterService {
    createCharacter (params: CreateCharacterServiceParams): CreateCharacterServiceResponse;
}

export type CreateCharacterServiceParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    abilityIds?: string[];
    proficiencyIds?: string[];
    statusIds?: string[];
    attributes?: Attribute[];
    assistantId: string;
};

export type CreateCharacterServiceResponse = {
    success: boolean;
    character?: Character,
    error?: string;
};
