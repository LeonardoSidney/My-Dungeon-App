import { useCallback } from 'react';
import { handleRegenerateContent as handleRegenerateContentUseCase } from '../handleRegenerateContent';
import { UseRegenerateContentParams } from './constants';

export function useRegenerateContent ({
  currentAdventure,
  setCurrentAdventure,
  setIsStreaming,
  handleStreamResponse,
  regenerateFromChat,
  alert,
}: UseRegenerateContentParams) {
  const handleRegenerateContent = useCallback(async (chatId: string) => {
    await handleRegenerateContentUseCase({
      currentAdventure,
      chatId,
      setCurrentAdventure,
      setIsStreaming,
      handleStreamResponse,
      regenerateFromChat,
      alert,
    });
  }, [currentAdventure, setCurrentAdventure, setIsStreaming, handleStreamResponse, regenerateFromChat, alert]);

  return { handleRegenerateContent };
}
