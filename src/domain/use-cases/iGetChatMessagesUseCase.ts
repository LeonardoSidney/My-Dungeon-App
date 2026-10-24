import { Chat } from '../entities';

export interface IGetChatMessagesUseCase {
    execute (params: GetChatMessagesUseCaseParams): Promise<GetChatMessagesUseCaseReturn>;
}

export type GetChatMessagesUseCaseParams = {
    adventureId: string;
};

export type GetChatMessagesUseCaseReturn = {
    success: boolean;
    chats?: Chat[];
    error?: string;
};
