import { useCallback, useRef, useState } from 'react';

type PromptResponse = {
    success: boolean;
    data?: string;
    error?: string;
};

type PromptState = {
    isLoading: boolean;
    prompt?: string;
    error?: string;
};

/** Loads a prompt on the first `request()` call only, so switching tabs back and forth does not refetch it. */
export function usePromptQuery (load: () => Promise<PromptResponse>) {
    const [state, setState] = useState<PromptState>({ isLoading: false });
    const requestedRef = useRef(false);

    const request = useCallback(async (): Promise<void> => {
        if (requestedRef.current) return;
        requestedRef.current = true;

        setState({ isLoading: true });
        const response = await load();
        setState(response.success
            ? { isLoading: false, prompt: response.data }
            : { isLoading: false, error: response.error ?? 'Failed to load the prompt' });
    }, [load]);

    return { ...state, request };
}
