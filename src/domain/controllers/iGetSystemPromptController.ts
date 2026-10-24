import { DetailControllerResponse, GetByIdControllerParams, SystemPromptDetails } from './iCrudControllerResponses';

export interface IGetSystemPromptController {
    handle (params: GetByIdControllerParams): Promise<GetSystemPromptControllerResponse>;
}

export type GetSystemPromptControllerResponse = DetailControllerResponse<SystemPromptDetails>;
