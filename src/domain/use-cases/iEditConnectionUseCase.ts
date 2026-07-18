import { Connection } from '../entities';

export interface IEditConnectionUseCase {
    execute(request: EditConnectionParams): Promise<EditConnectionReturn>;
}

export type EditConnectionParams = {
    id: string;
    name: string;
    ip: string;
    port?: number;
    auth?: string;
    createdAt: Date;
};

export type EditConnectionReturn = {
    connection?: Connection;
    success: boolean;
    error?: string;
};
