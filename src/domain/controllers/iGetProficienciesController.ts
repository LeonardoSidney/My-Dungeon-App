import { ListControllerResponse, ActivationPromptListItem } from './iCrudControllerResponses';

export interface IGetProficienciesController {
    handle (): Promise<GetProficienciesControllerResponse>;
}

export type GetProficienciesControllerResponse = ListControllerResponse<ActivationPromptListItem>;
