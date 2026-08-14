import { Adventure, Character } from '@domain/entities';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export type AsyncGeneratorRef = RefObject<AsyncGenerator<string> | null>;
export type AbortFunction = () => void;
export type AbortRef = RefObject<AbortFunction | null>;

export interface StreamingRefs {
    isAborted: RefObject<boolean>;
    stream: AsyncGeneratorRef;
    abort: AbortRef;
}

export interface StreamingSetters {
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
}

export interface AdventureChatScreenProps {
    adventure: Adventure;
    onBack: () => void;
    onCharacterSelect?: (adventure: Adventure) => void;
}

export interface RegenerateMessageParams {
    currentAdventure: Adventure;
    chatId: string;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    handleStreamResponse: (adventure: Adventure) => Promise<void>;
}

export type HandleRegenerateFromMessageParams = RegenerateMessageParams;
export type OnRegenerateFromMessageParams = RegenerateMessageParams;

export interface HandleStreamResponseParams {
    currentAdventure: Adventure;
    refs: StreamingRefs;
    setters: StreamingSetters;
}

export interface OnKeyPressInputParams {
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
    handleSendMessage: () => Promise<void>;
}

export interface OnResendParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
    handleStreamResponse: (adventure: Adventure) => Promise<void>;
}

export interface OnSendMessageParams {
    message: string;
    selectedCharacter: Character;
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
    handleStreamResponse: (adventure: Adventure) => Promise<void>;
}

export interface OnStopStreamingParams {
    refs: StreamingRefs;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
}

export interface HandleDeleteMessageParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
