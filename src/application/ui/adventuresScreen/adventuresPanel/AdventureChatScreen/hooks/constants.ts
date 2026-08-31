import { Dispatch, SetStateAction } from 'react';
import { ScrollView } from 'react-native';
import { Adventure, Character } from '@domain/entities';
import { HydratedAdventure, HydratedCharacter } from '@domain/use-cases';

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
}

export interface UseStreamResponseParams {
    isAbortedRef: React.RefObject<boolean>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    streamRef: React.RefObject<AsyncGenerator<string, void, void> | null>;
    abortRef: React.RefObject<(() => void) | null>;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    hydratedRef: React.RefObject<HydratedAdventure | null>;
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
    handleStreamResponse: (adventure: Adventure) => Promise<void>;
}

export interface UseResendParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
    handleStreamResponse: (adventure: Adventure) => Promise<void>;
}

export interface UseRegenerateFromMessageParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    handleStreamResponse: (adventure: Adventure) => Promise<void>;
}
