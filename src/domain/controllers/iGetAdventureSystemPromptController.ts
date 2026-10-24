import { DetailControllerResponse } from './iCrudControllerResponses';

export interface IGetAdventureSystemPromptController {
    handle (params: GetAdventureSystemPromptControllerParams): Promise<GetAdventureSystemPromptControllerResponse>;
}

export type GetAdventureSystemPromptControllerParams = {
    adventureId: string;
};

export type GetAdventureSystemPromptControllerResponse = DetailControllerResponse<string>;
