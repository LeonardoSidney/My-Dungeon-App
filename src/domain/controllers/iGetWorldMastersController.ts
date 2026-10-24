import { ListControllerResponse, ActivationPromptListItem } from './iCrudControllerResponses';

export interface IGetWorldMastersController {
    handle (): Promise<GetWorldMastersControllerResponse>;
}

export type GetWorldMastersControllerResponse = ListControllerResponse<ActivationPromptListItem>;
