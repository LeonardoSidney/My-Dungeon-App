import { ListControllerResponse, SystemPromptListItem } from './iCrudControllerResponses';

export interface IGetSystemPromptsController {
    handle (): Promise<GetSystemPromptsControllerResponse>;
}

export type GetSystemPromptsControllerResponse = ListControllerResponse<SystemPromptListItem>;
