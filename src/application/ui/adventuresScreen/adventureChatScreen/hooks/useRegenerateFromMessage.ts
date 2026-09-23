import { useCallback } from 'react';
import { handleRegenerateFromMessage as handleRegenerateFromMessageUseCase } from '../handleRegenerateFromMessage';
import { UseRegenerateFromMessageParams } from './constants';

export function useRegenerateFromMessage ({
    currentAdventure,
    setCurrentAdventure,
    setIsStreaming,
    handleStreamResponse,
    regenerateFromChat,
    alert,
}: UseRegenerateFromMessageParams) {
    const handleRegenerateFromMessage = useCallback(async (chatId: string) => {
        await handleRegenerateFromMessageUseCase({
            currentAdventure,
            chatId,
            setCurrentAdventure,
            setIsStreaming,
            handleStreamResponse,
            regenerateFromChat,
            alert,
        });
    }, [currentAdventure, setCurrentAdventure, setIsStreaming, handleStreamResponse, regenerateFromChat, alert]);

    return { handleRegenerateFromMessage };
}
