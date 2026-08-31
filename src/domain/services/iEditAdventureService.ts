import { Adventure, Chat } from '../entities';

export interface IEditAdventureService {
    editAdventure (params: EditAdventureServiceParams): EditAdventureServiceReturn;
}

export type EditAdventureServiceParams = {
    id: string;
    name: string;
    systemPromptIds: string[];
    characterIds: string[];
    worldMasterId?: string;
    characterAsWorldMasterId?: string;
    charactersControlledByAi: string[];
    worldIds: string[];
    locationIds: string[];
    itemIds: string[];
    chat: Chat[];
    createdAt: Date;
};

export type EditAdventureServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
