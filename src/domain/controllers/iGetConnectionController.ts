import { DetailControllerResponse, GetByIdControllerParams, ConnectionDetails } from './iCrudControllerResponses';

export interface IGetConnectionController {
    handle (params: GetByIdControllerParams): Promise<GetConnectionControllerResponse>;
}

export type GetConnectionControllerResponse = DetailControllerResponse<ConnectionDetails>;
