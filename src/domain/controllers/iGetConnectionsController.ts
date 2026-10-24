import { ListControllerResponse, ConnectionListItem } from './iCrudControllerResponses';

export interface IGetConnectionsController {
    handle (): Promise<GetConnectionsControllerResponse>;
}

export type GetConnectionsControllerResponse = ListControllerResponse<ConnectionListItem>;
