import { useStreaming } from './hooks/useStreaming';
import { useStreamResponse } from './hooks/useStreamResponse';
import { useResend } from './hooks/useResend';
import { useSendMessage } from './hooks/useSendMessage';
import { useRegenerateFromMessage } from './hooks/useRegenerateFromMessage';
import { useContinueFromMessage } from './hooks/useContinueFromMessage';
import { useStopStreaming } from './hooks/useStopStreaming';
import { UseAdventureStreamingParams } from './constants';

export function useAdventureStreaming (params: UseAdventureStreamingParams) {
    const { currentAdventure, selectedCharacter, message, setCurrentAdventure, setMessage, hydratedRef, editingChatIdRef, clearEditing, createChatAdventure, appendChatAdventure, startStreamingChat, updateStreamingChat, finishStreamingChat, getAdventureText, getNativeStreamCompletion } = params;

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
        getAdventureText,
        getNativeStreamCompletion
    });

    const { handleResend } = useResend({
        currentAdventure,
        setCurrentAdventure,
        setMessage,
        handleStreamResponse,
        editingChatIdRef,
        message,
        clearEditing
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
        editingChatIdRef,
        clearEditing
    });

    const { handleRegenerateFromMessage } = useRegenerateFromMessage({
        currentAdventure,
        setCurrentAdventure,
        setIsStreaming,
        handleStreamResponse
    });

    const { handleContinueFromMessage } = useContinueFromMessage({
        currentAdventure,
        setCurrentAdventure,
        setIsStreaming,
        handleStreamResponse
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
