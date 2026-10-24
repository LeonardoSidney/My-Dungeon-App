import { Adventure, Chat, Think } from '@domain/entities';

export interface IUpdateStreamingChatUseCase {
    execute (params: UpdateStreamingChatUseCaseParams): Promise<UpdateStreamingChatUseCaseReturn>;
}

export type UpdateStreamingChatUseCaseParams = {
    adventureId: string;
    chatId: string;
    content: string;
    think?: Think;
};

export type UpdateStreamingChatUseCaseReturn = {
    success: boolean;
    chat?: Chat;
    adventure?: Adventure;
    error?: string;
};
