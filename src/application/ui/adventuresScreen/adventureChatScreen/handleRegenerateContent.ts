import { HandleRegenerateContentParams } from './constants';

export async function handleRegenerateContent ({
  currentAdventure,
  chatId,
  setCurrentAdventure,
  setIsStreaming,
  handleStreamResponse,
  regenerateFromChat,
  alert,
}: HandleRegenerateContentParams): Promise<void> {
  if (!currentAdventure?.chat) {
    alert.handle({ title: 'Erro', message: 'Current adventure must have chat history' });
    return;
  }

  const response = await regenerateFromChat.handle({ adventure: currentAdventure, chatId, scope: 'content' });

  if (!response.success || !response.adventure) {
    alert.handle({ title: 'Erro', message: response.error ?? 'Failed to regenerate message content' });
    return;
  }

  setCurrentAdventure(response.adventure);

  setIsStreaming(true);

  try {
    await handleStreamResponse(response.adventure, response.chat?.id);
  } finally {
    setIsStreaming(false);
  }
}
