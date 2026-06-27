export type Ability = {
    id: string;
    name: string;
    activationWorld: string;
    prompt: string;
    observation?: string;
    createdAt: Date;
    updatedAt: Date;
};
