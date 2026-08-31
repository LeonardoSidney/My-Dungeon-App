export type Assistant = {
    id: string;
    name: string;
    observation?: string;
    modelId: string;
    samplerId: string;
    connectionId: string;
    createdAt: Date;
    updatedAt: Date;
};
