import { ListControllerResponse, ActivationPromptListItem } from './iCrudControllerResponses';

export interface IGetItemsController {
    handle (): Promise<GetItemsControllerResponse>;
}

export type GetItemsControllerResponse = ListControllerResponse<ActivationPromptListItem>;
