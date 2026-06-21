export type Item = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    createdAt: Date;
    updatedAt: Date;
};
