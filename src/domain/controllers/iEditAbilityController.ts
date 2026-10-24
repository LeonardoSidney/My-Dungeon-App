import { AbilityEditParams } from '../services';

export interface IEditAbilityController {
    handle (params: EditAbilityControllerParams): Promise<EditAbilityControllerResponse>;
}

export type EditAbilityControllerParams = {
    id: string;
    editParams: AbilityEditParams;
};

export type EditAbilityControllerResponse = {
    id?: string;
    success: boolean;
    error?: string;
};
