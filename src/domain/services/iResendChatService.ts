import { Adventure } from '@domain/entities';

export interface IResendChatService {
    resendChat (params: ResendChatServiceParams): ResendChatServiceReturn;
}

export type ResendChatServiceParams = {
    adventure: Adventure;
    chatId: string;
};

export type ResendChatServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
