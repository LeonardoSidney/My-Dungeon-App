import { Adventure } from '@domain/entities';

export interface IResendChatUseCase {
    execute (params: ResendChatUseCaseParams): Promise<ResendChatUseCaseReturn>;
}

export type ResendChatUseCaseParams = {
    adventure: Adventure;
    chatId: string;
};

export type ResendChatUseCaseReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
