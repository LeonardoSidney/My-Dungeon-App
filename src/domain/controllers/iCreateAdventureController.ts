import { MutationControllerResponse } from './iCrudControllerResponses';

export interface ICreateAdventureController {
    handle (request: CreateAdventureRequest): Promise<CreateAdventureResponse>;
}

export type AdventureFormRequest = {
    name: string;
    systemPromptIds: string[];
    playableCharacterIds: string[];
    aiControlledCharacterIds: string[];
    characterAsWorldMasterId?: string;
    worldMasterId?: string;
    worldIds: string[];
    locationIds: string[];
    itemIds: string[];
};

export type CreateAdventureRequest = AdventureFormRequest;

export type CreateAdventureResponse = MutationControllerResponse;
