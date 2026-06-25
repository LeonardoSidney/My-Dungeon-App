import { Adventure, Character, Item, Location, SystemPrompt, World, WorldMaster } from "../entities";

export interface ICreateAdventureService {
    createAdventure(params: CreateAdventureServiceParams): CreateAdventureServiceReturn;
}

export type CreateAdventureServiceParams = {
    name: string;
    systemPrompt: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    location?: Location;
    world?: World;
    items?: Item[];
};

export type CreateAdventureServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
