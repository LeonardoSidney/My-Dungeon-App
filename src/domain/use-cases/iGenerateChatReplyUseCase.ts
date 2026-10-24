import { Chat } from '../entities';
import type { ChatReplyStatus, ChatReplyStatusEnum } from '../providers';

export interface IGenerateChatReplyUseCase {
    execute (params: GenerateChatReplyUseCaseParams): Promise<GenerateChatReplyUseCaseReturn>;
}

export type GenerateChatReplyUseCaseParams = {
    adventureId: string;
    chatId?: string;
};

export type GenerateChatReplyUseCaseReturn = {
    success: boolean;
    chatId?: string;
    error?: string;
};

export type ChatReplySession = {
    adventureId: string;
    chat: Chat;
    tokens: AsyncIterable<string>;
    continuationBase: string;
    sessionThinkId: string;
    hasPreservedThink: boolean;
    isAborted: () => boolean;
};

export type ChatReplyOutcome = {
    status: Exclude<ChatReplyStatus, ChatReplyStatusEnum.STREAMING>;
    error?: string;
};
