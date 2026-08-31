export type WorldMaster = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistantId: string;
    createdAt: Date;
    updatedAt: Date;
};
