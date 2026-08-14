import { Dispatch, SetStateAction } from 'react';

export function handleStopStreaming (
    isAbortedRef: { current: boolean },
    streamRef: { current: AsyncGenerator<string, void, void> | null },
    abortRef: { current: (() => void) | null },
    setIsStreaming: Dispatch<SetStateAction<boolean>>
) {
    return () => {
        isAbortedRef.current = true;
        if (abortRef.current) {
            abortRef.current();
        }
        streamRef.current = null;
        setIsStreaming(false);
    };
}
