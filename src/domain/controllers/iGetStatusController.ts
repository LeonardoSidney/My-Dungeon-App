import { DetailControllerResponse, GetByIdControllerParams, ActivationPromptDetails } from './iCrudControllerResponses';

export interface IGetStatusController {
    handle (params: GetByIdControllerParams): Promise<GetStatusControllerResponse>;
}

export type GetStatusControllerResponse = DetailControllerResponse<ActivationPromptDetails>;
