import { Adventure } from '@domain/entities';

export interface IContinueFromChatController {
    handle (request: ContinueFromChatControllerRequest): Promise<ContinueFromChatControllerResponse>;
}

export type ContinueFromChatControllerRequest = {
    adventure: Adventure;
    chatId: string;
};

export type ContinueFromChatControllerResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
