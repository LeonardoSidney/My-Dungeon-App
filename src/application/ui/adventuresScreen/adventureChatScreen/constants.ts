import { Adventure, Character } from '@domain/entities';
import { HydratedAdventure } from '@domain/use-cases';
import { IAppendChatAdventureController, ICreateChatAdventureController } from '@domain/controllers';
import { AdventureChatScreenControllers } from '../constants';
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
    controllers: AdventureChatScreenControllers;
}

export interface AdventureChatContentProps {
    adventure: Adventure;
    hydrated: HydratedAdventure;
    hydratedRef: RefObject<HydratedAdventure | null>;
    onBack: () => void;
    controllers: AdventureChatScreenControllers;
}

export interface UseAdventureStreamingParams {
    currentAdventure: Adventure;
    selectedCharacter: Character;
    message: string;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
    hydratedRef: RefObject<HydratedAdventure | null>;
    editingChatIdRef: RefObject<string | null>;
    clearEditing: () => void;
    createChatAdventure: AdventureChatScreenControllers['createChatAdventure'];
    appendChatAdventure: AdventureChatScreenControllers['appendChatAdventure'];
    startStreamingChat: AdventureChatScreenControllers['startStreamingChat'];
    updateStreamingChat: AdventureChatScreenControllers['updateStreamingChat'];
    finishStreamingChat: AdventureChatScreenControllers['finishStreamingChat'];
    getAdventureText: AdventureChatScreenControllers['getAdventureText'];
    getNativeStreamCompletion: AdventureChatScreenControllers['getNativeStreamCompletion'];
}

export interface RegenerateMessageParams {
    currentAdventure: Adventure;
    chatId: string;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
}

export type HandleRegenerateFromMessageParams = RegenerateMessageParams;

export type HandleContinueFromMessageParams = RegenerateMessageParams;

export interface HandleEditMessageParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
}

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
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
    editingChatIdRef: RefObject<string | null>;
    message: string;
    clearEditing: () => void;
}

export interface OnSendMessageParams {
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

export interface HandleDeleteMessageParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
