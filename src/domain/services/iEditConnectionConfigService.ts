import { Connection } from '../entities';

export interface IEditConnectionConfigService {
    editConnectionConfig(request: EditConnectionConfigServiceParams): EditConnectionConfigServiceReturn;
}

export type EditConnectionConfigServiceParams = {
    id: string;
    name: string;
    ip: string;
    port?: number;
    auth?: string;
    createdAt: Date;
};

export type EditConnectionConfigServiceReturn = {
    success: boolean;
    connection?: Connection;
    error?: string;
};
