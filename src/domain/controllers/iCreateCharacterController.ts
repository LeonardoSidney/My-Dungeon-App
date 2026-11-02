import { Attribute } from '../entities';

export interface ICreateCharacterController {
    handle (params: CreateCharacterControllerParams): Promise<CreateCharacterControllerResponse>;
}

export type CreateCharacterControllerParams = {
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
