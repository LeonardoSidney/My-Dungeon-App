import { Adventure, Character, Chat, Item, Location, SystemPrompt, World, WorldMaster } from '../entities';

export interface IEditAdventureService {
    editAdventure (params: EditAdventureServiceParams): EditAdventureServiceReturn;
}

export type EditAdventureServiceParams = {
    id: string;
    name: string;
    systemPrompts: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    locations?: Location[];
    worlds?: World[];
    items?: Item[];
    chat: Chat[];
    createdAt: Date;
};

export type EditAdventureServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
