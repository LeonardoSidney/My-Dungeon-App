import { RegenerateFromChatScope } from '@domain/services';

export interface IRegenerateFromChatController {
    handle (request: RegenerateFromChatControllerRequest): Promise<RegenerateFromChatControllerResponse>;
}

export type RegenerateFromChatControllerRequest = {
    adventureId: string;
    chatId: string;
    scope?: RegenerateFromChatScope;
};

export type RegenerateFromChatControllerResponse = {
    success: boolean;
    replyChatId?: string;
    error?: string;
};
