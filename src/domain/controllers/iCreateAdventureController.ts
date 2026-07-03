import { Adventure, Character, Item, Location, SystemPrompt, World, WorldMaster } from '../entities';

export interface ICreateAdventureController {
    handle(request: CreateAdventureRequest): Promise<CreateAdventureResponse>;
}

export type CreateAdventureRequest = {
    name: string;
    systemPrompts: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    locations?: Location[];
    worlds?: World[];
    items?: Item[];
};

export type CreateAdventureResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
