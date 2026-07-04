import { Chat, Role, Think } from '@domain/entities';

export interface ICreateChatAdventureUseCase {
    execute(params: CreateChatAdventureUseCaseParams): Promise<CreateChatAdventureUseCaseReturn>;
}

export type CreateChatAdventureUseCaseParams = {
    content: string;
    role: Role;
    think?: Think;
};

export type CreateChatAdventureUseCaseReturn = {
    success: boolean;
    chat?: Chat;
    error?: string;
};
