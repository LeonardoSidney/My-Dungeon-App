import { HandleRegenerateFromMessageParams } from './constants';

export async function handleRegenerateFromMessage ({
    currentAdventure,
    chatId,
    setCurrentAdventure,
    setIsStreaming,
    handleStreamResponse,
    regenerateFromChat,
    alert,
}: HandleRegenerateFromMessageParams): Promise<void> {
    if (!currentAdventure?.chat) {
        alert.handle({ title: 'Erro', message: 'Current adventure must have chat history' });
        return;
    }

    const response = await regenerateFromChat.handle({ adventure: currentAdventure, chatId });

    if (!response.success || !response.adventure) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to regenerate from message' });
        return;
    }

    setCurrentAdventure(response.adventure);

    setIsStreaming(true);

    try {
        await handleStreamResponse(response.adventure);
    } finally {
        setIsStreaming(false);
    }
}
