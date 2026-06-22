import { Connection } from "../../../domain/entities";

export interface IConnectionRepository {
    saveConnection(params: SaveConnectionParams): Promise<boolean>;
    getConnections(): Promise<Connection[]>;
}

export type SaveConnectionParams = {
    connection: Connection
}
