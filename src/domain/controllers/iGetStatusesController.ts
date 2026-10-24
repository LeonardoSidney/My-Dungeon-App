import { ListControllerResponse, ActivationPromptListItem } from './iCrudControllerResponses';

export interface IGetStatusesController {
    handle (): Promise<GetStatusesControllerResponse>;
}

export type GetStatusesControllerResponse = ListControllerResponse<ActivationPromptListItem>;
