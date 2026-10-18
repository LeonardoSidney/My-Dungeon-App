import { Adventure, Chat } from '@domain/entities';
import { RegenerateFromChatScope } from '@domain/services';

export interface IRegenerateFromChatController {
    handle (request: RegenerateFromChatControllerRequest): Promise<RegenerateFromChatControllerResponse>;
}

export type RegenerateFromChatControllerRequest = {
    adventure: Adventure;
    chatId: string;
    scope?: RegenerateFromChatScope;
};

export type RegenerateFromChatControllerResponse = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
