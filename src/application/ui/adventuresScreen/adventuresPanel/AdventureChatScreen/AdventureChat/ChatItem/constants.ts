import { Chat } from '@domain/entities';

export interface ChatItemProps {
    chat: Chat;
    isStreaming: boolean;
    onDeleteMessage?: (chatId: string) => void;
    onRegenerateFromMessage?: (chatId: string) => void;
}
