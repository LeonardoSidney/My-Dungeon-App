import { Adventure, Chat } from '@domain/entities';

export interface IFinishStreamingChatController {
    handle(request: FinishStreamingChatControllerRequest): Promise<FinishStreamingChatControllerResponse>;
}

export type FinishStreamingChatControllerRequest = {
    adventure: Adventure;
    chatId: string;
};

export type FinishStreamingChatControllerResponse = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
