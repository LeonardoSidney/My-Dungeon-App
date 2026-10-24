import { DetailControllerResponse } from './iCrudControllerResponses';

export interface IGetAdventureTemplatedPromptController {
    handle (params: GetAdventureTemplatedPromptControllerParams): Promise<GetAdventureTemplatedPromptControllerResponse>;
}

export type GetAdventureTemplatedPromptControllerParams = {
    adventureId: string;
};

export type GetAdventureTemplatedPromptControllerResponse = DetailControllerResponse<string>;
