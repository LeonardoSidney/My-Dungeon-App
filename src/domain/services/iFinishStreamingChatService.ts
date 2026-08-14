import { Adventure, Chat } from '@domain/entities';

export interface IFinishStreamingChatService {
    finishStreamingChat(params: FinishStreamingChatServiceParams): FinishStreamingChatServiceReturn;
}

export type FinishStreamingChatServiceParams = {
    adventure: Adventure;
    chatId: string;
};

export type FinishStreamingChatServiceReturn = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
