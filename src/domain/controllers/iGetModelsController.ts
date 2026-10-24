import { ListControllerResponse, ModelOption } from './iCrudControllerResponses';

export interface IGetModelsController {
    handle (): Promise<GetModelsListControllerResponse>;
}

export type GetModelsListControllerResponse = ListControllerResponse<ModelOption>;
