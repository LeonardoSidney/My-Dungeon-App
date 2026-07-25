import { Ability } from '../entities';

export interface IEditAbilityService {
    editAbility (params: EditAbilityServiceParams): EditAbilityServiceReturn;
}

export type EditAbilityServiceParams = {
    ability: Ability;
};

export type EditAbilityServiceReturn = {
    ability?: Ability;
    success: boolean;
    error?: string;
};
