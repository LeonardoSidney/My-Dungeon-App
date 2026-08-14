import { useRef } from 'react';

export function useStreamingRefs () {
    const isAbortedRef = useRef(false);
    const streamRef = useRef<AsyncGenerator<string, void, void> | null>(null);
    const abortRef = useRef<(() => void) | null>(null);

    return {
        isAbortedRef,
        streamRef,
        abortRef
    };
}
