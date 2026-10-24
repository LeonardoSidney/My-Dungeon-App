import { DetailControllerResponse, GetByIdControllerParams, ActivationPromptDetails } from './iCrudControllerResponses';

export interface IGetAbilityController {
    handle (params: GetByIdControllerParams): Promise<GetAbilityControllerResponse>;
}

export type GetAbilityControllerResponse = DetailControllerResponse<ActivationPromptDetails>;
