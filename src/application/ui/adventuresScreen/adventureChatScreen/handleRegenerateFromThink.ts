import { HandleRegenerateFromThinkParams } from './constants';

export async function handleRegenerateFromThink ({
    currentAdventure,
    chatId,
    setCurrentAdventure,
    setIsStreaming,
    handleStreamResponse,
    regenerateFromChat,
    alert,
}: HandleRegenerateFromThinkParams): Promise<void> {
    if (!currentAdventure?.chat) {
        alert.handle({ title: 'Erro', message: 'Current adventure must have chat history' });
        return;
    }

    const response = await regenerateFromChat.handle({ adventure: currentAdventure, chatId });

    if (!response.success || !response.adventure) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to regenerate from think' });
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
