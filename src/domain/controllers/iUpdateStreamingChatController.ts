import { Adventure, Chat, Think } from '@domain/entities';

export interface IUpdateStreamingChatController {
    handle(request: UpdateStreamingChatControllerRequest): Promise<UpdateStreamingChatControllerResponse>;
}

export type UpdateStreamingChatControllerRequest = {
    adventure: Adventure;
    chatId: string;
    content: string;
    think?: Think;
};

export type UpdateStreamingChatControllerResponse = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
