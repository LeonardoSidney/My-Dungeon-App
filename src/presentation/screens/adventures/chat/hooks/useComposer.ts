import { useCallback, useState } from 'react';
import { TextInputKeyPressEvent } from 'react-native';
import {
    AdventureChatCharacter,
    IAddChatVersionController,
    IAlertController,
    IAppendChatAdventureController,
    IResendChatController,
} from '@domain/controllers';
import { showError } from '@presentation/utils/showError';
import type { StreamReply } from '../types';

type UseComposerParams = {
    adventureId: string;
    selectedCharacter?: AdventureChatCharacter;
    editingChatId: string | null;
    clearEditing: () => void;
    reloadMessages: () => Promise<void>;
    streamReply: StreamReply;
    appendChatAdventure: IAppendChatAdventureController;
    addChatVersion: IAddChatVersionController;
    resendChat: IResendChatController;
    alert: IAlertController;
};

export function useComposer ({
    adventureId,
    selectedCharacter,
    editingChatId,
    clearEditing,
    reloadMessages,
    streamReply,
    appendChatAdventure,
    addChatVersion,
    resendChat,
    alert,
}: UseComposerParams) {
    const [message, setMessage] = useState('');

    const saveEditedVersion = useCallback(async (chatId: string): Promise<boolean> => {
        const response = await addChatVersion.handle({ adventureId, chatId, content: message });
        if (!response.success) {
            showError(alert, response.error, 'Failed to save message edit');
        }
        return response.success;
    }, [adventureId, message, addChatVersion, alert]);

    const send = useCallback(async () => {
        if (editingChatId) {
            const hasText = Boolean(message.trim());
            if (hasText && !await saveEditedVersion(editingChatId)) {
                return;
            }
            setMessage('');
            clearEditing();
            if (hasText) {
                await reloadMessages();
            }
            return;
        }

        if (!message.trim()) {
            return;
        }
        if (!selectedCharacter) {
            showError(alert, undefined, 'This adventure has no character to speak as');
            return;
        }

        const response = await appendChatAdventure.handle({ adventureId, characterId: selectedCharacter.id, content: message });
        if (!response.success) {
            showError(alert, response.error, 'Failed to send message');
            return;
        }

        setMessage('');
        await streamReply();
    }, [adventureId, message, selectedCharacter, editingChatId, clearEditing, saveEditedVersion, reloadMessages, streamReply, appendChatAdventure, alert]);

    const resend = useCallback(async () => {
        if (editingChatId) {
            if (message.trim() && !await saveEditedVersion(editingChatId)) {
                return;
            }
            clearEditing();
            setMessage('');
        }

        const response = await resendChat.handle({ adventureId });
        if (!response.success) {
            showError(alert, response.error, 'Failed to resend message');
            return;
        }

        await streamReply();
    }, [adventureId, message, editingChatId, clearEditing, saveEditedVersion, streamReply, resendChat, alert]);

    const handleKeyPress = useCallback((event: TextInputKeyPressEvent) => {
        if (event.nativeEvent.key !== 'Enter') {
            return;
        }

        event.preventDefault();
        const isShiftPressed = (event.nativeEvent as { shiftKey?: boolean; }).shiftKey;
        if (isShiftPressed) {
            setMessage(current => `${current}\n`);
            return;
        }
        send();
    }, [send]);

    return { message, setMessage, send, resend, handleKeyPress };
}
