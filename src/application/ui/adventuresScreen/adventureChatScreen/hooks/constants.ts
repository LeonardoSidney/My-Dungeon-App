import { Dispatch, RefObject, SetStateAction } from 'react';
import { ScrollView } from 'react-native';
import { Adventure, Character } from '@domain/entities';
import { HydratedAdventure, HydratedCharacter } from '@domain/use-cases';
import {
    IAppendChatAdventureController,
    ICreateChatAdventureController,
    IFinishStreamingChatController,
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
    adventure: Adventure;
    hydratedCharacters: HydratedCharacter[];
}

export interface UseHydratedAdventureParams {
    adventure: Adventure;
    hydrateAdventure: IHydrateAdventureController;
}

export interface UseStreamResponseParams {
    isAbortedRef: React.RefObject<boolean>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    streamRef: React.RefObject<AsyncGenerator<string, void, void> | null>;
    abortRef: React.RefObject<(() => void) | null>;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    hydratedRef: React.RefObject<HydratedAdventure | null>;
    startStreamingChat: IStartStreamingChatController;
    updateStreamingChat: IUpdateStreamingChatController;
    finishStreamingChat: IFinishStreamingChatController;
    getAdventureText: IGetAdventureTextController;
    getNativeStreamCompletion: INativeStreamCompletionController;
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
    editingChatIdRef: RefObject<string | null>;
    clearEditing: () => void;
}

export interface UseResendParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
    editingChatIdRef: RefObject<string | null>;
    message: string;
    clearEditing: () => void;
}

export interface UseRegenerateFromMessageParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
}

export type UseContinueFromMessageParams = UseRegenerateFromMessageParams;
