import { useCallback } from 'react';
import { onSendMessage } from '../onSendMessage';
import { UseSendMessageParams } from './constants';

export function useSendMessage ({
    message,
    selectedCharacter,
    currentAdventure,
    setCurrentAdventure,
    setMessage,
    handleStreamResponse,
    createChatAdventure,
    appendChatAdventure,
    editChatAdventure,
    editingChatIdRef,
    clearEditing,
    alert
}: UseSendMessageParams) {
    const handleSendMessage = useCallback(async () => {
        await onSendMessage({
            message,
            selectedCharacter,
            currentAdventure,
            setCurrentAdventure,
            setMessage,
            handleStreamResponse,
            createChatAdventure,
            appendChatAdventure,
            editChatAdventure,
            editingChatIdRef,
            clearEditing,
            alert,
        });
    }, [message, selectedCharacter, currentAdventure, setCurrentAdventure, setMessage, handleStreamResponse, createChatAdventure, appendChatAdventure, editChatAdventure, editingChatIdRef, clearEditing, alert]);

    return { handleSendMessage };
}
