import { ListControllerResponse, ActivationPromptListItem } from './iCrudControllerResponses';

export interface IGetWorldsController {
    handle (): Promise<GetWorldsControllerResponse>;
}

export type GetWorldsControllerResponse = ListControllerResponse<ActivationPromptListItem>;
