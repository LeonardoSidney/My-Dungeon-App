import { Adventure } from '@domain/entities';

export interface IContinueFromChatService {
    continueFromChat (params: ContinueFromChatServiceParams): ContinueFromChatServiceReturn;
}

export type ContinueFromChatServiceParams = {
    adventure: Adventure;
    chatId: string;
};

export type ContinueFromChatServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
