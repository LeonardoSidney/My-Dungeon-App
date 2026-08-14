import { useCallback } from 'react';
import { onResend } from '../onResend';
import { UseResendParams } from './constants';

export function useResend ({
    currentAdventure,
    setCurrentAdventure,
    setMessage,
    handleStreamResponse
}: UseResendParams) {
    const handleResend = useCallback(async () => {
        await onResend({
            currentAdventure,
            setCurrentAdventure,
            setMessage,
            handleStreamResponse,
        });
    }, [currentAdventure, setCurrentAdventure, setMessage, handleStreamResponse]);

    return { handleResend };
}
