import { Dispatch, SetStateAction } from 'react';
import { Adventure, Character } from '@domain/entities';
import { useStreaming } from './hooks/useStreaming';
import { useStreamResponse } from './hooks/useStreamResponse';
import { useResend } from './hooks/useResend';
import { useSendMessage } from './hooks/useSendMessage';
import { useRegenerateFromMessage } from './hooks/useRegenerateFromMessage';
import { useStopStreaming } from './hooks/useStopStreaming';

interface UseAdventureStreamingParams {
    currentAdventure: Adventure;
    selectedCharacter: Character;
    message: string;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
}

export function useAdventureStreaming (params: UseAdventureStreamingParams) {
    const { currentAdventure, selectedCharacter, message, setCurrentAdventure, setMessage } = params;

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
        setCurrentAdventure
    });

    const { handleResend } = useResend({
        currentAdventure,
        setCurrentAdventure,
        setMessage,
        handleStreamResponse
    });

    const { handleSendMessage } = useSendMessage({
        message,
        selectedCharacter,
        currentAdventure,
        setCurrentAdventure,
        setMessage,
        handleStreamResponse
    });

    const { handleRegenerateFromMessage } = useRegenerateFromMessage({
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
        handleStopStreaming
    };
}
