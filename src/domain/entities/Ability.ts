export type Ability = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    createdAt: Date;
    updatedAt: Date;
};
