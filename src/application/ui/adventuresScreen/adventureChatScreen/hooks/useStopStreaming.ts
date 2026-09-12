import { useCallback } from 'react';
import { UseStopStreamingParams } from './constants';

export function useStopStreaming ({
    isAbortedRef,
    streamRef,
    abortRef,
    setIsStreaming
}: UseStopStreamingParams) {
    const handleStopStreaming = useCallback(() => {
        isAbortedRef.current = true;
        if (abortRef.current) {
            abortRef.current();
        }
        streamRef.current = null;
        setIsStreaming(false);
    }, [isAbortedRef, streamRef, abortRef, setIsStreaming]);

    return { handleStopStreaming };
}
