import { AdventureDetails, DetailControllerResponse, GetByIdControllerParams } from './iCrudControllerResponses';

export interface IGetAdventureController {
    handle (params: GetAdventureControllerParams): Promise<GetAdventureControllerResponse>;
}

export type GetAdventureControllerParams = GetByIdControllerParams;

export type GetAdventureControllerResponse = DetailControllerResponse<AdventureDetails>;
