import { Connection } from '../entities';
export interface ICreateConnectionConfigService {
    createConnectionConfig(request: CreateConnectionConfigServiceParams): CreateConnectionConfigServiceReturn;
}

export type CreateConnectionConfigServiceParams = {
    name: string;
    ip: string;
    port?: number;
    auth?: string;
};

export type CreateConnectionConfigServiceReturn = {
    success: boolean;
    connection?: Connection;
    error?: string;
};
