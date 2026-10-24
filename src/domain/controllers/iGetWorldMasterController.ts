import { DetailControllerResponse, GetByIdControllerParams, WorldMasterDetails } from './iCrudControllerResponses';

export interface IGetWorldMasterController {
    handle (params: GetByIdControllerParams): Promise<GetWorldMasterControllerResponse>;
}

export type GetWorldMasterControllerResponse = DetailControllerResponse<WorldMasterDetails>;
