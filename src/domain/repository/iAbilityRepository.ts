import { Ability } from '../entities';

export interface IAbilityRepository {
    saveAbility (params: SaveAbilityParams): Promise<SaveAbilityRepositoryReturn>;
    getAbilities (): Promise<GetAbilitiesRepositoryReturn>;
    getAbilityById (abilityId: string): Promise<GetAbilityByIdRepositoryReturn>;
    editAbility (params: EditAbilityParams): Promise<EditAbilityReturn>;
    eraseAbility (abilityId: string): Promise<EraseAbilityReturn>;
}

export type SaveAbilityParams = {
    ability: Ability;
};

export type EditAbilityParams = {
    ability: Ability;
};

export type SaveAbilityRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetAbilitiesRepositoryReturn = {
    success: boolean;
    abilities?: Ability[];
    error?: string;
};

export type GetAbilityByIdRepositoryReturn = {
    success: boolean;
    ability?: Ability;
    error?: string;
};

export type EditAbilityReturn = {
    success: boolean;
    error?: string;
};

export type EraseAbilityReturn = {
    success: boolean;
    error?: string;
};
