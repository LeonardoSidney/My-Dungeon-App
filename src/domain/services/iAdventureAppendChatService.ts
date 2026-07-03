import { Chat } from '@domain/entities';

export interface IAdventureAppendChatService {
    createChat(params: AdventureAppendChatServiceParams): AdventureAppendChatServiceReturn;
}

export type AdventureAppendChatServiceParams = {
    chat: Chat;
};

export type AdventureAppendChatServiceReturn = {
    success: boolean;
    chat?: Chat;
    error?: string;
};
