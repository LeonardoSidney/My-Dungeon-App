import { Assistant } from './Assistant';

export type WorldMaster = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistant: Assistant;
    createdAt: Date;
    updatedAt: Date;
};
