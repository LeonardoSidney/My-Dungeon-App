import { useCallback } from 'react';
import { handleRegenerateFromThink as handleRegenerateFromThinkUseCase } from '../handleRegenerateFromThink';
import { UseRegenerateFromThinkParams } from './constants';

export function useRegenerateFromThink ({
    currentAdventure,
    setCurrentAdventure,
    setIsStreaming,
    handleStreamResponse,
    regenerateFromChat,
    alert,
}: UseRegenerateFromThinkParams) {
    const handleRegenerateFromThink = useCallback(async (chatId: string) => {
        await handleRegenerateFromThinkUseCase({
            currentAdventure,
            chatId,
            setCurrentAdventure,
            setIsStreaming,
            handleStreamResponse,
            regenerateFromChat,
            alert,
        });
    }, [currentAdventure, setCurrentAdventure, setIsStreaming, handleStreamResponse, regenerateFromChat, alert]);

    return { handleRegenerateFromThink };
}
