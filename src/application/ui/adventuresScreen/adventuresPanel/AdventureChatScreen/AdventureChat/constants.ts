import { Chat } from '@domain/entities';

export interface AdventureChatProps {
    chats: Chat[];
    streamingChat?: Chat | null;
    onDeleteMessage?: (chatId: string) => void;
    onRegenerateFromMessage?: (chatId: string) => void;
}

export interface GetStreamingChatFromListParams {
    streamingChat: Chat | null | undefined;
    chats: Chat[];
}
