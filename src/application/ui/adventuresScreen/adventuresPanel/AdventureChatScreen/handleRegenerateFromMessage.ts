import { RoleEnum } from '@domain/entities';
import { HandleRegenerateFromMessageParams } from './constants';

export async function handleRegenerateFromMessage ({
    currentAdventure,
    chatId,
    setCurrentAdventure,
    setIsStreaming,
    handleStreamResponse,
}: HandleRegenerateFromMessageParams): Promise<void> {
    if (!currentAdventure?.chat) {
        throw new Error('Current adventure must have chat history');
    }

    const chatIndex = currentAdventure.chat.findIndex(c => c.id === chatId);
    if (chatIndex === -1) {
        throw new Error(`Chat with id ${chatId} not found`);
    }

    const chatsBeforeTarget = currentAdventure.chat.slice(0, chatIndex + 1);
    const reversedChats = [...chatsBeforeTarget].reverse();
    const userIndexInReversed = reversedChats.findIndex(chat => chat.role === RoleEnum.USER);
    const lastUserMessageIndex = chatsBeforeTarget.length - 1 - userIndexInReversed;

    if (lastUserMessageIndex === -1) {
        throw new Error(`No user message found before chat ${chatId}`);
    }

    const newChats = currentAdventure.chat.slice(0, lastUserMessageIndex + 1);
    const updatedAdventure = { ...currentAdventure, chat: newChats };
    setCurrentAdventure(updatedAdventure);

    setIsStreaming(true);

    try {
        await handleStreamResponse(updatedAdventure);
    } finally {
        setIsStreaming(false);
    }
}
