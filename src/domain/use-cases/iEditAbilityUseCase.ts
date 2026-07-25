import { Ability } from '../entities';

export interface IEditAbilityUseCase {
    execute (request: EditAbilityParams): Promise<EditAbilityReturn>;
}

export type EditAbilityParams = {
    ability: Ability;
};

export type EditAbilityReturn = {
    ability?: Ability;
    success: boolean;
    error?: string;
};
