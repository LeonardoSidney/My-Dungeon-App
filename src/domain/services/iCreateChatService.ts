import { Chat, Role, Think } from '@domain/entities';

export interface ICreateChatService {
    createChat(params: CreateChatServiceParams): CreateChatServiceReturn;
}

export type CreateChatServiceParams = {
    content: string;
    role: Role;
    think?: Think;
};

export type CreateChatServiceReturn = {
    success: boolean;
    chat?: Chat;
    error?: string;
};
