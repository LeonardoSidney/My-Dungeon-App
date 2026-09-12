import { Adventure, Chat, Role } from '@domain/entities';

export interface IStartStreamingChatUseCase {
    execute (params: StartStreamingChatUseCaseParams): Promise<StartStreamingChatUseCaseReturn>;
}

export type StartStreamingChatUseCaseParams = {
    adventure: Adventure;
    role: Role;
    characterId: string;
    chatId?: string;
};

export type StartStreamingChatUseCaseReturn = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
