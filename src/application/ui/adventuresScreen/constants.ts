import { Character, Chat, SystemPrompt, WorldMaster, World, Location, Item } from '@domain/entities';
import {
    IAppendChatAdventureController,
    ICreateChatAdventureController,
    IEditAdventureController,
    IFinishStreamingChatController,
    IGetAdventureTextController,
    IGetAdventuresController,
    INativeStreamCompletionController,
    IGetWorldMastersController,
    IHydrateAdventureController,
    IStartStreamingChatController,
    IUpdateStreamingChatController,
} from '@domain/controllers';

export interface AdventureChatScreenControllers {
    getAdventures: IGetAdventuresController;
    editAdventure: IEditAdventureController;
    hydrateAdventure: IHydrateAdventureController;
    createChatAdventure: ICreateChatAdventureController;
    appendChatAdventure: IAppendChatAdventureController;
    startStreamingChat: IStartStreamingChatController;
    updateStreamingChat: IUpdateStreamingChatController;
    finishStreamingChat: IFinishStreamingChatController;
    getAdventureText: IGetAdventureTextController;
    getNativeStreamCompletion: INativeStreamCompletionController;
    getWorldMasters: IGetWorldMastersController;
}

export interface AdventuresScreenProps {
    onChatVisibleChange?: (visible: boolean) => void;
}

export type FormErrors = {
    name?: string;
    systemPrompts?: string;
    characters?: string;
};

export type AdventureFormData = {
    id?: string;
    name: string;
    systemPrompts: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    characterAsWorldMasterId?: string;
    charactersControlledByAi: string[];
    worlds?: World[];
    locations?: Location[];
    items?: Item[];
    chat: Chat[];
};
