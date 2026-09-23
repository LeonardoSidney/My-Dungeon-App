import { useCallback } from 'react';
import { Adventure } from '@domain/entities';
import { handleStreamResponse } from '../handleStreamResponse';
import { UseStreamResponseParams } from './constants';

export function useStreamResponse ({
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
}: UseStreamResponseParams) {
    const handleStreamResponseInternal = useCallback(async (adventureToUpdate: Adventure, existingChatId?: string) => {
        const hydrated = hydratedRef.current;
        if (!hydrated) return;

        const updatedAdventure = await handleStreamResponse({
            adventureToUpdate,
            existingChatId,
            hydrated,
            isAbortedRef,
            setIsStreaming,
            streamRef,
            abortRef,
            setCurrentAdventure,
            startStreamingChat,
            updateStreamingChat,
            finishStreamingChat,
            deleteChatAdventure,
            getAdventureText,
            getNativeStreamCompletion,
            alert,
        });

        if (!updatedAdventure) return;

        setCurrentAdventure(updatedAdventure);
    }, [isAbortedRef, setIsStreaming, streamRef, abortRef, setCurrentAdventure, hydratedRef, startStreamingChat, updateStreamingChat, finishStreamingChat, deleteChatAdventure, getAdventureText, getNativeStreamCompletion, alert]);

    return { handleStreamResponse: handleStreamResponseInternal };
}
