import { Ability } from '../entities';

export interface ICreateAbilityController {
    handle(params: CreateAbilityControllerParams): Promise<CreateAbilityControllerResponse>;
}

export type CreateAbilityControllerParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateAbilityControllerResponse = {
    success: boolean;
    ability?: Ability;
    error?: string;
};
