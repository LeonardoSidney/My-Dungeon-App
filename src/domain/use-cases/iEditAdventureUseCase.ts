import { Adventure, Chat } from '../entities';

export interface IEditAdventureUseCase {
    execute (params: EditAdventureParams): Promise<EditAdventureReturn>;
}

export type EditAdventureParams = {
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
    createdAt?: Date;
};

export type EditAdventureReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
