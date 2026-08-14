import { Adventure, Chat } from '../entities';

export interface IAppendChatAdventureUseCase {
    execute(params: AppendChatUseCaseParams): Promise<AppendChatUseCaseReturn>;
}

export type AppendChatUseCaseParams = {
    adventure: Adventure;
    message: Chat;
};

export type AppendChatUseCaseReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
