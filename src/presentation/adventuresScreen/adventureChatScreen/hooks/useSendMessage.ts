import { useCallback } from 'react';
import { onSendMessage } from '../onSendMessage';
import { UseSendMessageParams } from './constants';

export function useSendMessage ({
    adventureId,
    message,
    selectedCharacter,
    reloadMessages,
    setMessage,
    streamReply,
    appendChatAdventure,
    addChatVersion,
    editingChatIdRef,
    clearEditing,
    alert
}: UseSendMessageParams) {
    const handleSendMessage = useCallback(async () => {
        await onSendMessage({
            adventureId,
            message,
            selectedCharacter,
            reloadMessages,
            setMessage,
            streamReply,
            appendChatAdventure,
            addChatVersion,
            editingChatIdRef,
            clearEditing,
            alert,
        });
    }, [adventureId, message, selectedCharacter, reloadMessages, setMessage, streamReply, appendChatAdventure, addChatVersion, editingChatIdRef, clearEditing, alert]);

    return { handleSendMessage };
}
