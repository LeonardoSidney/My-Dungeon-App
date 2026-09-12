import { Chat } from '@domain/entities';

export interface ChatItemProps {
    chat: Chat;
    isStreaming: boolean;
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
