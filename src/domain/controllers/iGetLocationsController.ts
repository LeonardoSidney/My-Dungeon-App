import { ListControllerResponse, ActivationPromptListItem } from './iCrudControllerResponses';

export interface IGetLocationsController {
    handle (): Promise<GetLocationsControllerResponse>;
}

export type GetLocationsControllerResponse = ListControllerResponse<ActivationPromptListItem>;
