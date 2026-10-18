import { Adventure, Chat } from '@domain/entities';

export type RegenerateFromChatScope = 'full' | 'content';

export interface IRegenerateFromChatService {
    regenerateFromChat (params: RegenerateFromChatServiceParams): RegenerateFromChatServiceReturn;
}

export type RegenerateFromChatServiceParams = {
    adventure: Adventure;
    chatId: string;
    scope?: RegenerateFromChatScope;
};

export type RegenerateFromChatServiceReturn = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
