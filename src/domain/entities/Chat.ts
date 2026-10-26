import { Role } from './Role';
import { Think } from './Think';

export type Chat = {
    id: string;
    role: Role;
    index: number;
    thinkIndex: number;
    content: string[];
    think?: Think[];
    characterId: string;
    modelId?: string;
    isStreaming?: boolean;
    createdAt: Date;
    updatedAt: Date;
};
