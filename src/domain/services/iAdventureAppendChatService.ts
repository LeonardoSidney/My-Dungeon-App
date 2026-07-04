import { Adventure, Chat } from '@domain/entities';

export interface IAdventureAppendChatService {
    appendChat(params: AdventureAppendChatServiceParams): AdventureAppendChatServiceReturn;
}

export type AdventureAppendChatServiceParams = {
    adventure: Adventure;
    chat: Chat;
};

export type AdventureAppendChatServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
