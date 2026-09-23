import { useStreaming } from './hooks/useStreaming';
import { useStreamResponse } from './hooks/useStreamResponse';
import { useResend } from './hooks/useResend';
import { useSendMessage } from './hooks/useSendMessage';
import { useRegenerateFromMessage } from './hooks/useRegenerateFromMessage';
import { useContinueFromMessage } from './hooks/useContinueFromMessage';
import { useStopStreaming } from './hooks/useStopStreaming';
import { UseAdventureStreamingParams } from './constants';

export function useAdventureStreaming (params: UseAdventureStreamingParams) {
    const { currentAdventure, selectedCharacter, message, setCurrentAdventure, setMessage, hydratedRef, editingChatIdRef, clearEditing, createChatAdventure, appendChatAdventure, editChatAdventure, startStreamingChat, updateStreamingChat, finishStreamingChat, deleteChatAdventure, getAdventureText, getNativeStreamCompletion, continueFromChat, regenerateFromChat, resendChat, alert } = params;

    const {
        isStreaming,
        isAbortedRef,
        streamRef,
        abortRef,
        setIsStreaming
    } = useStreaming();

    const { handleStreamResponse } = useStreamResponse({
        isAbortedRef,
        setIsStreaming,
        streamRef,
        abortRef,
        setCurrentAdventure,
        hydratedRef,
        startStreamingChat,
        updateStreamingChat,
        finishStreamingChat,
        deleteChatAdventure,
        getAdventureText,
        getNativeStreamCompletion,
        alert
    });

    const { handleResend } = useResend({
        currentAdventure,
        setCurrentAdventure,
        setMessage,
        handleStreamResponse,
        editingChatIdRef,
        message,
        clearEditing,
        editChatAdventure,
        resendChat,
        alert
    });

    const { handleSendMessage } = useSendMessage({
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
    });

    const { handleRegenerateFromMessage } = useRegenerateFromMessage({
        currentAdventure,
        setCurrentAdventure,
        setIsStreaming,
        handleStreamResponse,
        regenerateFromChat,
        alert,
    });

    const { handleContinueFromMessage } = useContinueFromMessage({
        currentAdventure,
        setCurrentAdventure,
        setIsStreaming,
        handleStreamResponse,
        continueFromChat,
        alert,
    });

    const { handleStopStreaming } = useStopStreaming({
        isAbortedRef,
        streamRef,
        abortRef,
        setIsStreaming
    });

    return {
        isStreaming,
        handleResend,
        handleSendMessage,
        handleRegenerateFromMessage,
        handleContinueFromMessage,
        handleStopStreaming
    };
}
