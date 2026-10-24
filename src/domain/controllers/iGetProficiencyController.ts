import { DetailControllerResponse, GetByIdControllerParams, ActivationPromptDetails } from './iCrudControllerResponses';

export interface IGetProficiencyController {
    handle (params: GetByIdControllerParams): Promise<GetProficiencyControllerResponse>;
}

export type GetProficiencyControllerResponse = DetailControllerResponse<ActivationPromptDetails>;
