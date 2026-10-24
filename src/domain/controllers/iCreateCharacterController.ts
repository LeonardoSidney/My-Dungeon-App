import { Attribute } from '../entities';

export interface ICreateCharacterController {
    handle (params: CreateCharacterControllerPrams): Promise<CreateCharacterControllerResponse>;
}

export type CreateCharacterControllerPrams = {
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

export type CreateCharacterControllerResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
