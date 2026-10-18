import { Adventure, Chat } from '@domain/entities';
import { RegenerateFromChatScope } from '@domain/services';

export interface IRegenerateFromChatUseCase {
    execute (params: RegenerateFromChatUseCaseParams): Promise<RegenerateFromChatUseCaseReturn>;
}

export type RegenerateFromChatUseCaseParams = {
    adventure: Adventure;
    chatId: string;
    scope?: RegenerateFromChatScope;
};

export type RegenerateFromChatUseCaseReturn = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
