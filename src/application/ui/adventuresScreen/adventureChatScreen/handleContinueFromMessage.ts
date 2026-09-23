import { HandleContinueFromMessageParams } from './constants';

export async function handleContinueFromMessage ({
    currentAdventure,
    chatId,
    setCurrentAdventure,
    setIsStreaming,
    handleStreamResponse,
    continueFromChat,
    alert,
}: HandleContinueFromMessageParams): Promise<void> {
    if (!currentAdventure?.chat) {
        alert.handle({ title: 'Erro', message: 'Current adventure must have chat history' });
        return;
    }

    const response = await continueFromChat.handle({ adventure: currentAdventure, chatId });

    if (!response.success || !response.adventure) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to continue from message' });
        return;
    }

    setCurrentAdventure(response.adventure);

    setIsStreaming(true);

    try {
        await handleStreamResponse(response.adventure, chatId);
    } finally {
        setIsStreaming(false);
    }
}
