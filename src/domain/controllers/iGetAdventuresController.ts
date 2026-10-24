import { AdventureListItem, ListControllerResponse } from './iCrudControllerResponses';

export interface IGetAdventuresController {
    handle (): Promise<GetAdventuresControllerResponse>;
}

export type GetAdventuresControllerResponse = ListControllerResponse<AdventureListItem>;
