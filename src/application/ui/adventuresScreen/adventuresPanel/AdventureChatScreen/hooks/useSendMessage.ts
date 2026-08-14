import { useCallback } from 'react';
import { onSendMessage } from '../onSendMessage';
import { UseSendMessageParams } from './constants';

export function useSendMessage ({
    message,
    selectedCharacter,
    currentAdventure,
    setCurrentAdventure,
    setMessage,
    handleStreamResponse
}: UseSendMessageParams) {
    const handleSendMessage = useCallback(async () => {
        await onSendMessage({
            message,
            selectedCharacter,
            currentAdventure,
            setCurrentAdventure,
            setMessage,
            handleStreamResponse,
        });
    }, [message, selectedCharacter, currentAdventure, setCurrentAdventure, setMessage, handleStreamResponse]);

    return { handleSendMessage };
}
