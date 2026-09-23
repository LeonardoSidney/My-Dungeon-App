import { Dispatch, RefObject, SetStateAction } from 'react';
import { ScrollView } from 'react-native';
import { Adventure, Character } from '@domain/entities';
import { HydratedAdventure, HydratedCharacter } from '@domain/use-cases';
import {
    IAlertController,
    IAppendChatAdventureController,
    ICreateChatAdventureController,
    IEditChatAdventureController,
    IFinishStreamingChatController,
    IDeleteChatAdventureController,
    IContinueFromChatController,
    IRegenerateFromChatController,
    IResendChatController,
    IGetAdventureTextController,
    IHydrateAdventureController,
    INativeStreamCompletionController,
    IStartStreamingChatController,
    IUpdateStreamingChatController,
} from '@domain/controllers';

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
    hydratedCharacters: HydratedCharacter[];
}

export interface UseHydratedAdventureParams {
    adventure: Adventure;
    hydrateAdventure: IHydrateAdventureController;
}

export interface UseStreamResponseParams {
    hydratedRef: RefObject<HydratedAdventure | null>;
    isAbortedRef: React.RefObject<boolean>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    streamRef: React.RefObject<AsyncGenerator<string, void, void> | null>;
    abortRef: React.RefObject<(() => void) | null>;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    startStreamingChat: IStartStreamingChatController;
    updateStreamingChat: IUpdateStreamingChatController;
    finishStreamingChat: IFinishStreamingChatController;
    deleteChatAdventure: IDeleteChatAdventureController;
    getAdventureText: IGetAdventureTextController;
    getNativeStreamCompletion: INativeStreamCompletionController;
    alert: IAlertController;
}

export interface UseStopStreamingParams {
    isAbortedRef: React.RefObject<boolean>;
    streamRef: React.RefObject<AsyncGenerator<string, void, void> | null>;
    abortRef: React.RefObject<(() => void) | null>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
}

export interface UseSendMessageParams {
    message: string;
    selectedCharacter: Character;
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
    createChatAdventure: ICreateChatAdventureController;
    appendChatAdventure: IAppendChatAdventureController;
    editChatAdventure: IEditChatAdventureController;
    editingChatIdRef: RefObject<string | null>;
    clearEditing: () => void;
    alert: IAlertController;
}

export interface UseResendParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
    editingChatIdRef: RefObject<string | null>;
    message: string;
    clearEditing: () => void;
    editChatAdventure: IEditChatAdventureController;
    resendChat: IResendChatController;
    alert: IAlertController;
}

export interface UseRegenerateFromMessageParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
    regenerateFromChat: IRegenerateFromChatController;
    alert: IAlertController;
}

export interface UseContinueFromMessageParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
    continueFromChat: IContinueFromChatController;
    alert: IAlertController;
}
