export type ModelTemplate = {
    id: string;
    modelId: string;
    connection: string;
    template: string;
    hash?: string;
    editedByUser: boolean;
    createdAt: Date;
    updatedAt: Date;
};
