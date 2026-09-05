import { Ability } from '../entities';
import { AbilityEditParams } from '../services';

export interface IEditAbilityController {
    handle (params: EditAbilityControllerParams): Promise<EditAbilityControllerResponse>;
}

export type EditAbilityControllerParams = {
    id: string;
    editParams: AbilityEditParams;
};

export type EditAbilityControllerResponse = {
    ability?: Ability;
    success: boolean;
    error?: string;
};
