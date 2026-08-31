import { Adventure, Chat, Role } from '@domain/entities';

export interface IStartStreamingChatService {
    startStreamingChat (params: StartStreamingChatServiceParams): StartStreamingChatServiceReturn;
}

export type StartStreamingChatServiceParams = {
    adventure: Adventure;
    role: Role;
    characterId: string;
};

export type StartStreamingChatServiceReturn = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
