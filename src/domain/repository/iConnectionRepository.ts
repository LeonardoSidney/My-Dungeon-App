import { Connection } from '../entities';

export interface IConnectionRepository {
    saveConnection (params: SaveConnectionParams): Promise<SaveConnectionRepositoryReturn>;
    getConnections (): Promise<GetConnectionsRepositoryReturn>;
    getConnectionById (connectionId: string): Promise<GetConnectionByIdRepositoryReturn>;
    editConnection (params: EditConnectionParams): Promise<EditConnectionRepositoryReturn>;
    eraseConnection (connectionId: string): Promise<EraseConnectionRepositoryReturn>;
}

export type SaveConnectionParams = {
    connection: Connection;
};

export type EditConnectionParams = {
    connection: Connection;
};

export type SaveConnectionRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetConnectionsRepositoryReturn = {
    success: boolean;
    connections?: Connection[];
    error?: string;
};

export type GetConnectionByIdRepositoryReturn = {
    success: boolean;
    connection?: Connection;
    error?: string;
};

export type EditConnectionRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type EraseConnectionRepositoryReturn = {
    success: boolean;
    error?: string;
};
