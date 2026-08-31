import { Chat } from '@domain/entities';

export interface ChatItemProps {
    chat: Chat;
    isStreaming: boolean;
    characterNameById: Record<string, string>;
    onDeleteMessage?: (chatId: string) => void;
    onRegenerateFromMessage?: (chatId: string) => void;
}
