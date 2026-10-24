import { Adventure } from '../entities';

export interface ICreateAdventureService {
    createAdventure (params: CreateAdventureServiceParams): CreateAdventureServiceReturn;
}

export type AdventureFormFields = {
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

export type CreateAdventureServiceParams = AdventureFormFields;

export type CreateAdventureServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
