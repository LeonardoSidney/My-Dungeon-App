import { DetailControllerResponse, GetByIdControllerParams, ActivationPromptDetails } from './iCrudControllerResponses';

export interface IGetItemController {
    handle (params: GetByIdControllerParams): Promise<GetItemControllerResponse>;
}

export type GetItemControllerResponse = DetailControllerResponse<ActivationPromptDetails>;
