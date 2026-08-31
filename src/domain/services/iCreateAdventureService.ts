import { Adventure } from '../entities';

export interface ICreateAdventureService {
    createAdventure (params: CreateAdventureServiceParams): CreateAdventureServiceReturn;
}

export type CreateAdventureServiceParams = {
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

export type CreateAdventureServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
