import { useCallback } from 'react';
import { useStreamingController } from './useStreamingController';

export function useStreaming () {
    const {
        isStreaming,
        isAbortedRef,
        streamRef,
        abortRef,
        startStreaming,
        abort,
        reset,
        setIsStreaming
    } = useStreamingController();

    const beginStreaming = useCallback((
        generator: AsyncGenerator<string, void, void>,
        abortFn?: (() => void) | null
    ) => {
        startStreaming(generator, abortFn);
    }, [startStreaming]);

    const stopStreaming = useCallback(() => {
        abort();
    }, [abort]);

    const clearStreaming = useCallback(() => {
        reset();
    }, [reset]);

    return {
        isStreaming,
        isAbortedRef,
        streamRef,
        abortRef,
        beginStreaming,
        stopStreaming,
        clearStreaming,
        setIsStreaming
    };
}
