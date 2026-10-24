import { Dispatch, RefObject, SetStateAction } from 'react';
import { ScrollView } from 'react-native';
import { AdventureChatCharacter, ChatMessageView } from '@domain/controllers';
import {
    IAlertController,
    IAppendChatAdventureController,
    IAddChatVersionController,
    IDeleteThinkVersionController,
    IResendChatController,
    ISelectChatVersionController,
    IGetChatMessageController,
    IGetChatMessagesController,
    ISubscribeChatReplyController,
} from '@domain/controllers';
import { ChatVersionKind } from '@domain/controllers';
import { SetMessages, StreamReply, UpdateMessages } from '../constants';

export interface UseScrollToBottomParams {
    scrollViewRef: React.RefObject<ScrollView | null>;
    setIsScrollingProgrammatically: (value: boolean) => void;
}

export interface UseScrollHandlerParams {
    isAtBottom: boolean;
    isScrollingProgrammatically: boolean;
    lastContentHeight: number;
    setIsAtBottom: (value: boolean) => void;
    setIsScrollingProgrammatically: (value: boolean) => void;
    setLastContentHeight: (value: number) => void;
    onShowScrollButton: (show: boolean) => void;
}

export interface UseAdventureChatStateParams {
    characters: AdventureChatCharacter[];
}

export interface UseSendMessageParams {
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

export interface UseResendParams {
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

export interface UseThinkActionsParams {
    adventureId: string;
    messages: ChatMessageView[];
    reloadMessages: () => Promise<void>;
    deleteThinkVersion: IDeleteThinkVersionController;
    alert: IAlertController;
}

export interface UseNavVersionIndexParams {
    adventureId: string;
    kind: ChatVersionKind;
    reloadMessages: () => Promise<void>;
    selectChatVersion: ISelectChatVersionController;
}

export interface UseChatReplyUpdatesParams {
    adventureId: string;
    subscribeChatReply: ISubscribeChatReplyController;
    getChatMessage: IGetChatMessageController;
    getChatMessages: IGetChatMessagesController;
    setMessages: SetMessages;
    updateMessages: UpdateMessages;
    alert: IAlertController;
}
