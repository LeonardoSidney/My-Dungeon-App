import { ChatMessageView, ChatThinkView } from '@domain/controllers';

export type VersionDirection = -1 | 1;

export type SetMessages = (messages: ChatMessageView[]) => void;
export type UpdateMessages = (update: (messages: ChatMessageView[]) => ChatMessageView[]) => void;
export type StreamReply = (replyChatId?: string) => Promise<void>;

/**
 * Everything a message can do, grouped in one object so the list passes a
 * single stable prop down instead of one callback per action.
 */
export type ChatMessageActions = {
    deleteMessage: (message: ChatMessageView) => void;
    startEdit: (chatId: string) => void;
    saveEdit: (chatId: string, content: string) => void;
    discardEdit: () => void;
    continueFrom: (chatId: string) => void;
    regenerateFrom: (chatId: string) => void;
    regenerateContent: (chatId: string) => void;
    navigateContent: (chatId: string, direction: VersionDirection) => void;
    navigateThink: (chatId: string, direction: VersionDirection) => void;
    regenerateFromThink: (chatId: string) => void;
    startThinkEdit: (chatId: string) => void;
    saveThinkEdit: (chatId: string, content: string) => void;
    discardThinkEdit: () => void;
    deleteThink: (chatId: string, think: ChatThinkView) => void;
};
