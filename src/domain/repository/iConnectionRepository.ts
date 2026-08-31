import { Connection } from '../entities';

export type EraseConnectionRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type EditConnectionRepositoryReturn = {
    success: boolean;
    error?: string;
};

export interface IConnectionRepository {
    saveConnection (params: SaveConnectionParams): Promise<boolean>;
    getConnections (): Promise<Connection[]>;
    getConnectionById (connectionId: string): Promise<Connection | undefined>;
    eraseConnection (connectionId: string): Promise<EraseConnectionRepositoryReturn>;
    editConnection (params: EditConnectionParams): Promise<EditConnectionRepositoryReturn>;
}

export type SaveConnectionParams = {
    connection: Connection;
};

export type EditConnectionParams = {
    connection: Connection;
};
