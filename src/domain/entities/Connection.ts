export type Connection = {
    id: string;
    name: string;
    ip: string;
    port?: number;
    auth?: string;
    createdAt: Date;
    updatedAt: Date;
};
