import { Adventure, Chat, Role } from '@domain/entities';

export interface IStartStreamingChatController {
    handle (request: StartStreamingChatControllerRequest): Promise<StartStreamingChatControllerResponse>;
}

export type StartStreamingChatControllerRequest = {
    adventure: Adventure;
    role: Role;
    characterId: string;
    chatId?: string;
};

export type StartStreamingChatControllerResponse = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
