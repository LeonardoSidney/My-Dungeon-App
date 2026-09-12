import { useCallback } from 'react';
import { handleContinueFromMessage as handleContinueFromMessageUseCase } from '../handleContinueFromMessage';
import { UseContinueFromMessageParams } from './constants';

export function useContinueFromMessage ({
    currentAdventure,
    setCurrentAdventure,
    setIsStreaming,
    handleStreamResponse
}: UseContinueFromMessageParams) {
    const handleContinueFromMessage = useCallback(async (chatId: string) => {
        await handleContinueFromMessageUseCase({
            currentAdventure,
            chatId,
            setCurrentAdventure,
            setIsStreaming,
            handleStreamResponse,
        });
    }, [currentAdventure, setCurrentAdventure, setIsStreaming, handleStreamResponse]);

    return { handleContinueFromMessage };
}
