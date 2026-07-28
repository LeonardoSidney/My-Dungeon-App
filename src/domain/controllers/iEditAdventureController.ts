import { Adventure, Character, Chat, Item, Location, SystemPrompt, World, WorldMaster } from '../entities';

export interface IEditAdventureController {
    handle (request: EditAdventureControllerRequest): Promise<EditAdventureControllerResponse>;
}

export type EditAdventureControllerRequest = {
    id: string;
    name: string;
    systemPrompts: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    locations?: Location[];
    worlds?: World[];
    items?: Item[];
    chat: Chat[];
    createdAt?: Date;
};

export type EditAdventureControllerResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
