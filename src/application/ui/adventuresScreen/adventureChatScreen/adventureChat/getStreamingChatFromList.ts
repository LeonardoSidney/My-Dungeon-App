import { Chat } from '@domain/entities';
import { GetStreamingChatFromListParams } from './constants';

export function getStreamingChatFromList ({
    streamingChat,
    chats,
}: GetStreamingChatFromListParams): Chat | null {
    if (streamingChat) {
        return streamingChat;
    }

    const lastChat = chats.length > 0 ? chats[chats.length - 1] : null;
    return lastChat?.isStreaming ? lastChat : null;
}
