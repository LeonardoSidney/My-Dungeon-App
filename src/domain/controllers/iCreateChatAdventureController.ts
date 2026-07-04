import { Chat, Role, Think } from '@domain/entities';

export interface ICreateChatAdventureController {
    handle(request: CreateChatAdventureControllerRequest): Promise<CreateChatAdventureControllerResponse>;
}

export type CreateChatAdventureControllerRequest = {
    content: string;
    role: Role;
    think?: Think;
};

export type CreateChatAdventureControllerResponse = {
    success: boolean;
    chat?: Chat;
    error?: string;
};
