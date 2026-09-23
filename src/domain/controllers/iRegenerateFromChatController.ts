import { Adventure } from '@domain/entities';

export interface IRegenerateFromChatController {
    handle (request: RegenerateFromChatControllerRequest): Promise<RegenerateFromChatControllerResponse>;
}

export type RegenerateFromChatControllerRequest = {
    adventure: Adventure;
    chatId: string;
};

export type RegenerateFromChatControllerResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
