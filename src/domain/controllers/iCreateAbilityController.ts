import { Ability } from "../entities/Ability";

export interface ICreateAbilityController {
    handle(params: CreateAbilityControllerParams): Promise<CreateAbilityControllerResponse>;
}

export type CreateAbilityControllerParams = {
    name: string;
    activationWorld: string;
    prompt: string;
    observation?: string;
};

export type CreateAbilityControllerResponse = {
    success: boolean;
    ability?: Ability;
    error?: string;
};
