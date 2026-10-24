import { useCallback } from 'react';
import { onResend } from '../onResend';
import { UseResendParams } from './constants';

export function useResend ({
    adventureId,
    setMessage,
    streamReply,
    editingChatIdRef,
    message,
    clearEditing,
    addChatVersion,
    resendChat,
    alert,
}: UseResendParams) {
    const handleResend = useCallback(async () => {
        await onResend({
            adventureId,
            setMessage,
            streamReply,
            editingChatIdRef,
            message,
            clearEditing,
            addChatVersion,
            resendChat,
            alert,
        });
    }, [adventureId, setMessage, streamReply, editingChatIdRef, message, clearEditing, addChatVersion, resendChat, alert]);

    return { handleResend };
}
