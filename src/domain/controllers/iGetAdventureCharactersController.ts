import { EntityOption, ListControllerResponse } from './iCrudControllerResponses';

export type AdventureChatCharacter = EntityOption;

export interface IGetAdventureCharactersController {
    handle (params: GetAdventureCharactersControllerParams): Promise<GetAdventureCharactersControllerResponse>;
}

export type GetAdventureCharactersControllerParams = {
    adventureId: string;
};

export type GetAdventureCharactersControllerResponse = ListControllerResponse<AdventureChatCharacter>;
