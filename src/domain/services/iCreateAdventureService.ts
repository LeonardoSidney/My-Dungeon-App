import { Adventure, Character, Item, Location, SystemPrompt, World, WorldMaster } from '../entities';

export interface ICreateAdventureService {
    createAdventure(params: CreateAdventureServiceParams): CreateAdventureServiceReturn;
}

export type CreateAdventureServiceParams = {
    name: string;
    systemPrompts: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    locations?: Location[];
    worlds?: World[];
    items?: Item[];
};

export type CreateAdventureServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
