import { Role } from '../entities';

export type ChatThinkView = {
    content?: string;
    index: number;
    count: number;
};

export type ChatMessageView = {
    id: string;
    role: Role;
    characterId: string;
    content: string;
    contentIndex: number;
    contentCount: number;
    think?: ChatThinkView;
    isStreaming: boolean;
};
