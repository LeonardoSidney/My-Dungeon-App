import { ListControllerResponse, ActivationPromptListItem } from './iCrudControllerResponses';

export interface IGetCharactersController {
    handle (): Promise<GetCharactersControllerResponse>;
}

export type GetCharactersControllerResponse = ListControllerResponse<ActivationPromptListItem>;
