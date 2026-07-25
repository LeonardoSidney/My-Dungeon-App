import { Ability } from '../entities';

export interface IEditAbilityController {
    handle (params: EditAbilityControllerParams): Promise<EditAbilityControllerResponse>;
}

export type EditAbilityControllerParams = {
    ability: Ability;
};

export type EditAbilityControllerResponse = {
    ability?: Ability;
    success: boolean;
    error?: string;
};
