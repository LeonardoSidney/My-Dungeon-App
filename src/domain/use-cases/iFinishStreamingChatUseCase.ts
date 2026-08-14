import { Adventure, Chat } from '@domain/entities';

export interface IFinishStreamingChatUseCase {
    execute(params: FinishStreamingChatUseCaseParams): Promise<FinishStreamingChatUseCaseReturn>;
}

export type FinishStreamingChatUseCaseParams = {
    adventure: Adventure;
    chatId: string;
};

export type FinishStreamingChatUseCaseReturn = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
