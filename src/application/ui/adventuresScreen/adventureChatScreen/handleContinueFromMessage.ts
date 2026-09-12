import { Alert } from 'react-native';
import { HandleContinueFromMessageParams } from './constants';

export async function handleContinueFromMessage ({
    currentAdventure,
    chatId,
    setCurrentAdventure,
    setIsStreaming,
    handleStreamResponse,
}: HandleContinueFromMessageParams): Promise<void> {
    if (!currentAdventure?.chat) {
        Alert.alert('Erro', 'Current adventure must have chat history');
        return;
    }

    const chatIndex = currentAdventure.chat.findIndex(c => c.id === chatId);
    if (chatIndex === -1) {
        Alert.alert('Erro', `Chat with id ${chatId} not found`);
        return;
    }

    const chatsUpToTarget = currentAdventure.chat.slice(0, chatIndex + 1);
    const updatedAdventure = { ...currentAdventure, chat: chatsUpToTarget };
    setCurrentAdventure(updatedAdventure);

    setIsStreaming(true);

    try {
        await handleStreamResponse(updatedAdventure, chatId);
    } finally {
        setIsStreaming(false);
    }
}
