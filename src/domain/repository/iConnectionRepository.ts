import { Connection } from "../entities";

export interface IConnectionRepository {
    saveConnection(params: SaveConnectionParams): Promise<boolean>;
    getConnections(): Promise<Connection[]>;
}

export type SaveConnectionParams = {
    connection: Connection
}
