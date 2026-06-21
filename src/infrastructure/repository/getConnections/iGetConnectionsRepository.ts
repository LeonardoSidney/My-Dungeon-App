import { Connection } from "../../../domain/entities";

export interface IGetConnectionsRepository {
    getConnections(): Promise<Connection[]>;
}
