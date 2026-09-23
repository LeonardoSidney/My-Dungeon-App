import { Adventure } from '@domain/entities';

export interface IResendChatController {
    handle (request: ResendChatControllerRequest): Promise<ResendChatControllerResponse>;
}

export type ResendChatControllerRequest = {
    adventure: Adventure;
    chatId: string;
};

export type ResendChatControllerResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
