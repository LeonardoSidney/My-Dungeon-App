import { Adventure, Chat, Think } from '@domain/entities';

export interface IUpdateStreamingChatService {
    updateStreamingChat(params: UpdateStreamingChatServiceParams): UpdateStreamingChatServiceReturn;
}

export type UpdateStreamingChatServiceParams = {
    adventure: Adventure;
    chatId: string;
    content: string;
    think?: Think;
};

export type UpdateStreamingChatServiceReturn = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
