import { Adventure } from '@domain/entities';

export interface IRegenerateFromChatService {
    regenerateFromChat (params: RegenerateFromChatServiceParams): RegenerateFromChatServiceReturn;
}

export type RegenerateFromChatServiceParams = {
    adventure: Adventure;
    chatId: string;
};

export type RegenerateFromChatServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
