import {
    EntityOption,
    IAppendChatAdventureController,
    IAddChatVersionController,
    IDeleteChatAdventureController,
    IDeleteChatVersionController,
    IAddThinkVersionController,
    IDeleteThinkVersionController,
    IContinueFromChatController,
    IRegenerateFromChatController,
    IResendChatController,
    IGenerateChatReplyController,
    IGetWorldMastersController,
    IAlertController,
    ISelectChatVersionController,
    ISetAdventureWorldMasterController,
    IGetAdventureSummaryController,
    IGetAdventureCharactersController,
    IGetAdventureWorldMasterController,
    IGetChatMessagesController,
    IGetChatMessageController,
    IStopChatReplyController,
    ISubscribeChatReplyController,
} from '@domain/controllers';

export interface AdventureChatScreenControllers {
    getAdventureSummary: IGetAdventureSummaryController;
    getAdventureCharacters: IGetAdventureCharactersController;
    getAdventureWorldMaster: IGetAdventureWorldMasterController;
    getChatMessages: IGetChatMessagesController;
    getChatMessage: IGetChatMessageController;
    stopChatReply: IStopChatReplyController;
    subscribeChatReply: ISubscribeChatReplyController;
    appendChatAdventure: IAppendChatAdventureController;
    addChatVersion: IAddChatVersionController;
    deleteChatAdventure: IDeleteChatAdventureController;
    deleteChatVersion: IDeleteChatVersionController;
    addThinkVersion: IAddThinkVersionController;
    deleteThinkVersion: IDeleteThinkVersionController;
    continueFromChat: IContinueFromChatController;
    regenerateFromChat: IRegenerateFromChatController;
    resendChat: IResendChatController;
    generateChatReply: IGenerateChatReplyController;
    selectChatVersion: ISelectChatVersionController;
    getWorldMasters: IGetWorldMastersController;
    setAdventureWorldMaster: ISetAdventureWorldMasterController;
    alert: IAlertController;
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
    systemPrompts: EntityOption[];
    characters: EntityOption[];
    worldMaster?: EntityOption;
    characterAsWorldMasterId?: string;
    charactersControlledByAi: string[];
    worlds?: EntityOption[];
    locations?: EntityOption[];
    items?: EntityOption[];
};
