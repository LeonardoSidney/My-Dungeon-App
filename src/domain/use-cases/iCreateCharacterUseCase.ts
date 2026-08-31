import { Attribute, Character } from '../entities';

export interface ICreateCharacterUseCase {
    execute (params: CreateCharacterUseCasePrams): Promise<CreateCharacterUseCaseResponse>;
}

export type CreateCharacterUseCasePrams = {
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

export type CreateCharacterUseCaseResponse = {
    success: boolean;
    character?: Character;
    error?: string;
};
