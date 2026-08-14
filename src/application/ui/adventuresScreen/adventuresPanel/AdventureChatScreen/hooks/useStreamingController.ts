import { useRef, useState, useCallback, useEffect } from 'react';

export function useStreamingController () {
    const [isStreaming, setIsStreaming] = useState(false);
    const isAbortedRef = useRef(false);

    const abortControllerRef = useRef<AbortController | null>(null);
    const streamRef = useRef<AsyncGenerator<string, void, void> | null>(null);
    const abortFnRef = useRef<(() => void) | null>(null);

    const startStreaming = useCallback((
        generator: AsyncGenerator<string, void, void>,
        abortFn?: (() => void) | null
    ) => {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        streamRef.current = generator;
        abortFnRef.current = abortFn || null;
        isAbortedRef.current = false;
        setIsStreaming(true);

        return controller.signal;
    }, []);

    const abort = useCallback(() => {
        isAbortedRef.current = true;
        setIsStreaming(false);

        abortControllerRef.current?.abort();
        abortFnRef.current?.();
        streamRef.current?.return();

        streamRef.current = null;
        abortFnRef.current = null;
        abortControllerRef.current = null;
    }, []);

    const reset = useCallback(() => {
        isAbortedRef.current = false;
        setIsStreaming(false);
        streamRef.current = null;
        abortFnRef.current = null;
        abortControllerRef.current = null;
    }, []);

    useEffect(() => {
        return () => {
            abort();
        };
    }, [abort]);

    return {
        isStreaming,
        isAbortedRef,
        streamRef,
        abortRef: abortFnRef,
        startStreaming,
        abort,
        reset,
        setIsStreaming
    };
}
