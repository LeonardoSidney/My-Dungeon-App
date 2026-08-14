import { Chat } from '@domain/entities';

export interface AdventureChatProps {
    chats: Chat[];
    streamingChat?: Chat | null;
    onDeleteMessage?: (chatId: string) => void;
    onRegenerateFromMessage?: (chatId: string) => void;
}

export interface ChatRenderData {
    think: any;
    isStreamingChat: boolean;
    streamingThink: any;
    hasThink: boolean;
    hasStreamingThink: boolean;
    isUserMessage: boolean;
    chatItemStyle: any;
    chatContent: React.ReactNode;
}

export interface GetChatRenderDataParams {
    chat: Chat;
    streamingChatFromList: Chat | null;
}

export interface GetStreamingChatFromListParams {
    streamingChat: Chat | null | undefined;
    chats: Chat[];
}
