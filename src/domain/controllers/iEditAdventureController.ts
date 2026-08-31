import { Adventure, Chat } from '../entities';

export interface IEditAdventureController {
    handle (request: EditAdventureControllerRequest): Promise<EditAdventureControllerResponse>;
}

export type EditAdventureControllerRequest = {
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

export type EditAdventureControllerResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
