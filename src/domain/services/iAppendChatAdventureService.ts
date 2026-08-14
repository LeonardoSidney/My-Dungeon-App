import { Adventure, Chat } from '@domain/entities';

export interface IAppendChatAdventureService {
    appendChat(params: AppendChatAdventureServiceParams): AppendChatAdventureServiceReturn;
}

export type AppendChatAdventureServiceParams = {
    adventure: Adventure;
    chat: Chat;
};

export type AppendChatAdventureServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
