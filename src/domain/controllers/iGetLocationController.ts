import { DetailControllerResponse, GetByIdControllerParams, ActivationPromptDetails } from './iCrudControllerResponses';

export interface IGetLocationController {
    handle (params: GetByIdControllerParams): Promise<GetLocationControllerResponse>;
}

export type GetLocationControllerResponse = DetailControllerResponse<ActivationPromptDetails>;
