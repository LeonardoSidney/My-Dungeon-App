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
    editingChatIdRef,
    clearEditing
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
            editingChatIdRef,
            clearEditing,
        });
    }, [message, selectedCharacter, currentAdventure, setCurrentAdventure, setMessage, handleStreamResponse, createChatAdventure, appendChatAdventure, editingChatIdRef, clearEditing]);

    return { handleSendMessage };
}
