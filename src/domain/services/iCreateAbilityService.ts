import { Ability } from '../entities';

export interface ICreateAbilityService {
    createAbility(params: CreateAbilityServiceParams): CreateAbilityServiceReturn;
}

export type CreateAbilityServiceParams = {
    name: string;
    activationWorld: string;
    prompt: string;
    observation?: string;
};

export type CreateAbilityServiceReturn = {
    success: boolean;
    ability?: Ability;
    error?: string;
};
