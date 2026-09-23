import { Adventure, Character } from '@domain/entities';
import { HydratedAdventure } from '@domain/use-cases';
import {
    IAppendChatAdventureController,
    ICreateChatAdventureController,
    IEditChatAdventureController,
    IContinueFromChatController,
    IRegenerateFromChatController,
    IResendChatController,
    IAlertController,
} from '@domain/controllers';
import { AdventureChatScreenControllers } from '../constants';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export interface AdventureChatScreenProps {
    adventure: Adventure;
    onBack: () => void;
    onCharacterSelect?: (adventure: Adventure) => void;
    controllers: AdventureChatScreenControllers;
}

export interface AdventureChatContentProps {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
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
    editChatAdventure: AdventureChatScreenControllers['editChatAdventure'];
    startStreamingChat: AdventureChatScreenControllers['startStreamingChat'];
    updateStreamingChat: AdventureChatScreenControllers['updateStreamingChat'];
    finishStreamingChat: AdventureChatScreenControllers['finishStreamingChat'];
    getAdventureText: AdventureChatScreenControllers['getAdventureText'];
    getNativeStreamCompletion: AdventureChatScreenControllers['getNativeStreamCompletion'];
    continueFromChat: AdventureChatScreenControllers['continueFromChat'];
    regenerateFromChat: AdventureChatScreenControllers['regenerateFromChat'];
    resendChat: AdventureChatScreenControllers['resendChat'];
    deleteChatAdventure: AdventureChatScreenControllers['deleteChatAdventure'];
    alert: IAlertController;
}

export interface HandleRegenerateFromMessageParams {
    currentAdventure: Adventure;
    chatId: string;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
    regenerateFromChat: IRegenerateFromChatController;
    alert: IAlertController;
}

export interface HandleContinueFromMessageParams {
    currentAdventure: Adventure;
    chatId: string;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setIsStreaming: Dispatch<SetStateAction<boolean>>;
    handleStreamResponse: (adventure: Adventure, existingChatId?: string) => Promise<void>;
    continueFromChat: IContinueFromChatController;
    alert: IAlertController;
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
    editChatAdventure: IEditChatAdventureController;
    resendChat: IResendChatController;
    alert: IAlertController;
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
    editChatAdventure: IEditChatAdventureController;
    editingChatIdRef: RefObject<string | null>;
    clearEditing: () => void;
    alert: IAlertController;
}

export interface HandleNavChatIndexParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
}

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
