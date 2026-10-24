import {
    AdventureChatCharacter,
    AdventureChatWorldMaster,
    ChatMessageView,
    RegenerateFromChatControllerResponse,
    IAlertController,
    IAppendChatAdventureController,
    IAddChatVersionController,
    IGenerateChatReplyController,
    IResendChatController,
    ISelectChatVersionController,
    ChatReplyUpdateView,
} from '@domain/controllers';
import { ChatVersionKind } from '@domain/controllers';
import { AdventureChatScreenControllers } from '../constants';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export type SetMessages = (messages: ChatMessageView[]) => void;
export type UpdateMessages = (update: (messages: ChatMessageView[]) => ChatMessageView[]) => void;
export type StreamReply = (replyChatId?: string) => Promise<void>;

export interface AdventureChatScreenProps {
    adventureId: string;
    onBack: () => void;
    controllers: AdventureChatScreenControllers;
}

export interface AdventureChatContentProps {
    adventureId: string;
    adventureName: string;
    characters: AdventureChatCharacter[];
    worldMaster: AdventureChatWorldMaster | null;
    messages: ChatMessageView[];
    setMessages: SetMessages;
    updateMessages: UpdateMessages;
    reloadWorldMaster: () => Promise<void>;
    onBack: () => void;
    controllers: AdventureChatScreenControllers;
}

export interface UseAdventureStreamingParams {
    adventureId: string;
    selectedCharacter: AdventureChatCharacter;
    message: string;
    setMessages: SetMessages;
    updateMessages: UpdateMessages;
    setMessage: Dispatch<SetStateAction<string>>;
    editingChatIdRef: RefObject<string | null>;
    clearEditing: () => void;
    appendChatAdventure: AdventureChatScreenControllers['appendChatAdventure'];
    addChatVersion: AdventureChatScreenControllers['addChatVersion'];
    continueFromChat: AdventureChatScreenControllers['continueFromChat'];
    regenerateFromChat: AdventureChatScreenControllers['regenerateFromChat'];
    resendChat: AdventureChatScreenControllers['resendChat'];
    generateChatReply: AdventureChatScreenControllers['generateChatReply'];
    getChatMessages: AdventureChatScreenControllers['getChatMessages'];
    getChatMessage: AdventureChatScreenControllers['getChatMessage'];
    stopChatReply: AdventureChatScreenControllers['stopChatReply'];
    subscribeChatReply: AdventureChatScreenControllers['subscribeChatReply'];
    alert: IAlertController;
}

export interface RequestChatReplyParams {
    adventureId: string;
    replyChatId?: string;
    generateChatReply: IGenerateChatReplyController;
    reloadMessages: () => Promise<void>;
    alert: IAlertController;
}

export interface HandleChatReplyUpdateParams {
    update: ChatReplyUpdateView;
    reloadMessage: (chatId: string) => Promise<void>;
    reloadMessages: () => Promise<void>;
    setIsReplying: (isReplying: boolean) => void;
    alert: IAlertController;
}

export interface HandleReplyActionParams {
    prepare: () => Promise<RegenerateFromChatControllerResponse>;
    fallbackError: string;
    streamReply: StreamReply;
    alert: IAlertController;
}

export interface OnKeyPressInputParams {
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
    handleSendMessage: () => Promise<void>;
}

export interface OnResendParams {
    adventureId: string;
    setMessage: Dispatch<SetStateAction<string>>;
    streamReply: StreamReply;
    editingChatIdRef: RefObject<string | null>;
    message: string;
    clearEditing: () => void;
    addChatVersion: IAddChatVersionController;
    resendChat: IResendChatController;
    alert: IAlertController;
}

export interface OnSendMessageParams {
    adventureId: string;
    message: string;
    selectedCharacter: AdventureChatCharacter;
    reloadMessages: () => Promise<void>;
    setMessage: Dispatch<SetStateAction<string>>;
    streamReply: StreamReply;
    appendChatAdventure: IAppendChatAdventureController;
    addChatVersion: IAddChatVersionController;
    editingChatIdRef: RefObject<string | null>;
    clearEditing: () => void;
    alert: IAlertController;
}

export interface HandleNavVersionIndexParams {
    adventureId: string;
    kind: ChatVersionKind;
    reloadMessages: () => Promise<void>;
    selectChatVersion: ISelectChatVersionController;
}

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
