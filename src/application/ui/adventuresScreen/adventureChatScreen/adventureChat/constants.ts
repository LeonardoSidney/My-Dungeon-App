import { ChatMessageView } from '@domain/controllers';

export interface AdventureChatProps {
    messages: ChatMessageView[];
    characterNameById: Record<string, string>;
    onDeleteMessage?: (chatId: string) => void;
    isMessageEditing?: boolean;
    editingChatId?: string | null;
    onEditMessage?: (chatId: string) => void;
    onSaveEditMessage?: (chatId: string, content: string) => void;
    onDiscardEdit?: () => void;
    onContinueFromMessage?: (chatId: string) => void;
    onRegenerateFromMessage?: (chatId: string) => void;
    onRegenerateContent?: (chatId: string) => void;
    onNavigateChatIndex?: (chatId: string, direction: -1 | 1) => void;
    onNavigateThinkIndex?: (chatId: string, direction: -1 | 1) => void;
    onRegenerateFromThink?: (chatId: string) => void;
    onEditThink?: (chatId: string) => void;
    onSaveThinkEdit?: (chatId: string, content: string) => void;
    onDiscardThinkEdit?: () => void;
    onDeleteThink?: (chatId: string) => void;
    isThinkEditing?: boolean;
    editingThinkChatId?: string | null;
}
