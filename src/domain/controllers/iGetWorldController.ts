import { DetailControllerResponse, GetByIdControllerParams, ActivationPromptDetails } from './iCrudControllerResponses';

export interface IGetWorldController {
    handle (params: GetByIdControllerParams): Promise<GetWorldControllerResponse>;
}

export type GetWorldControllerResponse = DetailControllerResponse<ActivationPromptDetails>;
