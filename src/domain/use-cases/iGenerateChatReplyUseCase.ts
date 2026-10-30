import { Chat } from '../entities';
import type { ChatReplyStatus, ChatReplyStatusEnum } from '../providers';
import type { SpeakerRuntime, TurnSpeaker } from '../services/iTurnSpeakerService';

export interface IGenerateChatReplyUseCase {
    execute (params: GenerateChatReplyUseCaseParams): Promise<GenerateChatReplyUseCaseReturn>;
}

export type GenerateChatReplyUseCaseParams = {
    adventureId: string;
    chatId?: string;
    skipPlayerTurn?: boolean;
};

export type GenerateChatReplyUseCaseReturn = {
    success: boolean;
    chatId?: string;
    error?: string;
};

export type ChatReplyTurn = {
    adventureId: string;
    isAborted: () => boolean;
    abort: () => void;
    track: (abortCompletion: () => void) => void;
};

export type ChatReplySession = {
    adventureId: string;
    chat: Chat;
    speaker: TurnSpeaker;
    runtime: SpeakerRuntime;
    continuationBase: string;
    sessionThinkId: string;
    hasPreservedThink: boolean;
    turn: ChatReplyTurn;
};

export type ChatReplyStepReturn = {
    success: boolean;
    session?: ChatReplySession;
    error?: string;
};

export type ChatReplyStreamReturn = {
    success: boolean;
    stream?: AsyncIterable<string>;
    error?: string;
};

export type ChatReplyContextReturn = {
    success: boolean;
    context?: string;
    error?: string;
};

export type ChatReplyConsumption = {
    text: string;
    interruption?: string;
};

export type ChatReplyOutcome = {
    status: Exclude<ChatReplyStatus, ChatReplyStatusEnum.STREAMING>;
    error?: string;
};
