import { Adventure, Chat, Role } from '@domain/entities';

export interface IStartStreamingChatUseCase {
    execute (params: StartStreamingChatUseCaseParams): Promise<StartStreamingChatUseCaseReturn>;
}

export type StartStreamingChatUseCaseParams = {
    adventureId: string;
    role: Role;
    characterId: string;
    chatId?: string;
    modelId?: string;
};

export type StartStreamingChatUseCaseReturn = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
