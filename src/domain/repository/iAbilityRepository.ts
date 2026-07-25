import { Ability } from '../entities';

export interface IAbilityRepository {
    saveAbility (params: SaveAbilityParams): Promise<boolean>;
    getAbilities (): Promise<Ability[]>;
    editAbility (params: EditAbilityParams): Promise<EditAbilityReturn>;
    eraseAbility (abilityId: string): Promise<EraseAbilityReturn>;
}

export type SaveAbilityParams = {
    ability: Ability;
};

export type EditAbilityParams = {
    ability: Ability;
};

export type EditAbilityReturn = {
    success: boolean;
    error?: string;
};

export type EraseAbilityReturn = {
    success: boolean;
    error?: string;
};
