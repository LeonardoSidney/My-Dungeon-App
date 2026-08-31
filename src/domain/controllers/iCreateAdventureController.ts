import { Adventure } from '../entities';

export interface ICreateAdventureController {
    handle (request: CreateAdventureRequest): Promise<CreateAdventureResponse>;
}

export type CreateAdventureRequest = {
    name: string;
    systemPromptIds: string[];
    characterIds: string[];
    worldMasterId?: string;
    characterAsWorldMasterId?: string;
    charactersControlledByAi: string[];
    worldIds: string[];
    locationIds: string[];
    itemIds: string[];
};

export type CreateAdventureResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
