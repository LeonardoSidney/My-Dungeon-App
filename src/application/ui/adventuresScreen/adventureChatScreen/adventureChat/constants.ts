import { Chat } from '@domain/entities';

export interface AdventureChatProps {
    chats: Chat[];
    streamingChat?: Chat | null;
    characterNameById: Record<string, string>;
    onDeleteMessage?: (chatId: string) => void;
    isMessageEditing?: boolean;
    editingChatId?: string | null;
    onEditMessage?: (chatId: string) => void;
    onSaveEditMessage?: (chatId: string, content: string) => void;
    onDiscardEdit?: () => void;
    onContinueFromMessage?: (chatId: string) => void;
    onRegenerateFromMessage?: (chatId: string) => void;
}

export interface GetStreamingChatFromListParams {
    streamingChat: Chat | null | undefined;
    chats: Chat[];
}
