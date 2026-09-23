import { Chat } from '@domain/entities';

export interface ChatItemProps {
    chat: Chat;
    isStreaming: boolean;
    characterNameById: Record<string, string>;
    onDeleteMessage?: (chatId: string, index: number) => void;
    isMessageEditing?: boolean;
    editingChatId?: string | null;
    onEditMessage?: (chatId: string) => void;
    onSaveEditMessage?: (chatId: string, content: string) => void;
    onDiscardEdit?: () => void;
    onContinueFromMessage?: (chatId: string) => void;
    onRegenerateFromMessage?: (chatId: string) => void;
    onNavigateChatIndex?: (chatId: string, direction: -1 | 1) => void;
}
