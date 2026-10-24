import { DetailControllerResponse, GetByIdControllerParams, AssistantDetails } from './iCrudControllerResponses';

export interface IGetAssistantController {
    handle (params: GetByIdControllerParams): Promise<GetAssistantControllerResponse>;
}

export type GetAssistantControllerResponse = DetailControllerResponse<AssistantDetails>;
