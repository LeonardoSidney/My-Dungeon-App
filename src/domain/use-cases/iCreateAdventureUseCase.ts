import { Adventure } from '../entities';

export interface ICreateAdventureUseCase {
    execute (request: CreateAdventureCaseParams): Promise<CreateAdventureCaseReturn>;
}

export type CreateAdventureCaseParams = {
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

export type CreateAdventureCaseReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
