import { Chat } from '../entities';

export interface IGetChatByIdUseCase {
    execute (params: GetChatByIdUseCaseParams): Promise<GetChatByIdUseCaseReturn>;
}

export type GetChatByIdUseCaseParams = {
    adventureId: string;
    chatId: string;
};

export type GetChatByIdUseCaseReturn = {
    success: boolean;
    chat?: Chat;
    error?: string;
};
