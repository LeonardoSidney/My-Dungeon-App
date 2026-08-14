import { OnRegenerateFromMessageParams } from './constants';

export async function onRegenerateFromMessage ({
    currentAdventure,
    chatId,
    setCurrentAdventure,
    setIsStreaming,
    handleStreamResponse,
}: OnRegenerateFromMessageParams): Promise<void> {
    if (!currentAdventure?.chat) {
        throw new Error('Current adventure must have chat history');
    }

    const index = currentAdventure.chat.findIndex(c => c.id === chatId);
    if (index === -1) {
        throw new Error(`Chat ${chatId} not found in adventure`);
    }

    const updatedChats = currentAdventure.chat.slice(0, index + 1);
    const updatedAdventure = { ...currentAdventure, chat: updatedChats };
    setCurrentAdventure(updatedAdventure);

    setIsStreaming(true);
    try {
        await handleStreamResponse(updatedAdventure);
    } finally {
        setIsStreaming(false);
    }
}
