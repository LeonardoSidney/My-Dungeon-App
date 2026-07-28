import { Adventure, Character, Chat, Item, Location, SystemPrompt, World, WorldMaster } from '../entities';

export interface IEditAdventureUseCase {
    execute (params: EditAdventureParams): Promise<EditAdventureReturn>;
}

export type EditAdventureParams = {
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

export type EditAdventureReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
