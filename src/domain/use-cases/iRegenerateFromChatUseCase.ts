import { Adventure } from '@domain/entities';

export interface IRegenerateFromChatUseCase {
    execute (params: RegenerateFromChatUseCaseParams): Promise<RegenerateFromChatUseCaseReturn>;
}

export type RegenerateFromChatUseCaseParams = {
    adventure: Adventure;
    chatId: string;
};

export type RegenerateFromChatUseCaseReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
