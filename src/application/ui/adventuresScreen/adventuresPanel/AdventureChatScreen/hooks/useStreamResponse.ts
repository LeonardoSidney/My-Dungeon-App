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
    hydratedRef
}: UseStreamResponseParams) {
    const handleStreamResponseInternal = useCallback(async (adventureToUpdate: Adventure) => {
        const updatedAdventure = await handleStreamResponse({
            adventureToUpdate,
            hydratedRef,
            isAbortedRef,
            setIsStreaming,
            streamRef,
            abortRef,
            setCurrentAdventure,
        });

        if (!updatedAdventure) return;

        setCurrentAdventure(updatedAdventure);
    }, [isAbortedRef, setIsStreaming, streamRef, abortRef, setCurrentAdventure, hydratedRef]);

    return { handleStreamResponse: handleStreamResponseInternal };
}
