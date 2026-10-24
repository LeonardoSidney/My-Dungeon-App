import { ListControllerResponse, ActivationPromptListItem } from './iCrudControllerResponses';

export interface IGetAbilitiesController {
    handle (): Promise<GetAbilitiesControllerResponse>;
}

export type GetAbilitiesControllerResponse = ListControllerResponse<ActivationPromptListItem>;
