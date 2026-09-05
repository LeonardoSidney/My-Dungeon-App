import { Ability } from '../entities';
import { AbilityEditParams } from '../services';

export interface IEditAbilityUseCase {
    execute (request: EditAbilityParams): Promise<EditAbilityReturn>;
}

export type EditAbilityParams = {
    id: string;
    editParams: AbilityEditParams;
};

export type EditAbilityReturn = {
    ability?: Ability;
    success: boolean;
    error?: string;
};
