import { Connection } from '../entities';

export interface IEditConnectionConfigService {
    editConnectionConfig(request: EditConnectionConfigServiceParams): EditConnectionConfigServiceReturn;
}

export type ConnectionEditParams = Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>;

export type EditConnectionConfigServiceParams = {
    connection: Connection;
    editParams: ConnectionEditParams;
};

export type EditConnectionConfigServiceReturn = {
    success: boolean;
    connection?: Connection;
    error?: string;
};
