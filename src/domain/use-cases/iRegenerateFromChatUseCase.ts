import { RegenerateFromChatScope } from '@domain/services';

export interface IRegenerateFromChatUseCase {
    execute (params: RegenerateFromChatUseCaseParams): Promise<RegenerateFromChatUseCaseReturn>;
}

export type RegenerateFromChatUseCaseParams = {
    adventureId: string;
    chatId: string;
    scope?: RegenerateFromChatScope;
};

export type RegenerateFromChatUseCaseReturn = {
    success: boolean;
    replyChatId?: string;
    error?: string;
};
