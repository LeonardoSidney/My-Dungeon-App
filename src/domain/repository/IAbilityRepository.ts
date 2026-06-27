import { Ability } from "../entities/Ability";

export interface IAbilityRepository {
    saveAbility(params: SaveAbilityParams): Promise<boolean>;
    getAbilities(): Promise<Ability[]>;
}

export type SaveAbilityParams = {
    ability: Ability;
};
