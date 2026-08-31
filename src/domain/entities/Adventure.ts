import { Chat } from './Chat';

export type Adventure = {
    id: string;
    name: string;
    chat: Chat[];
    characterIds: string[];
    worldMasterId?: string;
    characterAsWorldMasterId?: string;
    charactersControlledByAi: string[];
    systemPromptIds: string[];
    worldIds: string[];
    locationIds: string[];
    itemIds: string[];
    createdAt: Date;
    updatedAt: Date;
};
