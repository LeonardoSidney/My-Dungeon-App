import { Role } from './Role';
import { Think } from './Think';

export type Chat = {
    id: string;
    role: Role;
    index: number;
    content: string[];
    think?: Think[];
    characterName: string;
    isStreaming?: boolean;
    createdAt: Date;
    updatedAt: Date;
};
