import { Adventure } from '@domain/entities';

export interface IContinueFromChatUseCase {
    execute (params: ContinueFromChatUseCaseParams): Promise<ContinueFromChatUseCaseReturn>;
}

export type ContinueFromChatUseCaseParams = {
    adventure: Adventure;
    chatId: string;
};

export type ContinueFromChatUseCaseReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
