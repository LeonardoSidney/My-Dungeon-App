import { useCallback } from 'react';
import { onResend } from '../onResend';
import { UseResendParams } from './constants';

export function useResend ({
    currentAdventure,
    setCurrentAdventure,
    setMessage,
    handleStreamResponse,
    editingChatIdRef,
    message,
    clearEditing
}: UseResendParams) {
    const handleResend = useCallback(async () => {
        await onResend({
            currentAdventure,
            setCurrentAdventure,
            setMessage,
            handleStreamResponse,
            editingChatIdRef,
            message,
            clearEditing,
        });
    }, [currentAdventure, setCurrentAdventure, setMessage, handleStreamResponse, editingChatIdRef, message, clearEditing]);

    return { handleResend };
}
