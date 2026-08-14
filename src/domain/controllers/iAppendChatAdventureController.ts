import { Adventure, Chat } from '@domain/entities';

export interface IAppendChatAdventureController {
    handle(request: AppendChatControllerRequest): Promise<AppendChatControllerResponse>;
}

export type AppendChatControllerRequest = {
    adventure: Adventure;
    message: Chat;
};

export type AppendChatControllerResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
