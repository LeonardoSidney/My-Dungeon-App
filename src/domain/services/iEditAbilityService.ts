import { Ability } from '../entities';

export type AbilityEditParams = Omit<Ability, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEditAbilityService {
    editAbility (params: EditAbilityServiceParams): EditAbilityServiceReturn;
}

export type EditAbilityServiceParams = {
    ability: Ability;
    editParams: AbilityEditParams;
};

export type EditAbilityServiceReturn = {
    ability?: Ability;
    success: boolean;
    error?: string;
};
