import { DetailControllerResponse, EntityOption } from './iCrudControllerResponses';

export type AdventureSummary = EntityOption;

export interface IGetAdventureSummaryController {
    handle (params: GetAdventureSummaryControllerParams): Promise<GetAdventureSummaryControllerResponse>;
}

export type GetAdventureSummaryControllerParams = {
    adventureId: string;
};

export type GetAdventureSummaryControllerResponse = DetailControllerResponse<AdventureSummary>;
