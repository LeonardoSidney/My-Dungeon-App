import { Connection } from "../../../domain/entities";

export interface ICreateConnectionConfigRepository {
    saveConnection(params: CreateConnectionConfigRepositoryParams): Promise<boolean>;
    getConnections(): Promise<Connection[]>;
}

export type CreateConnectionConfigRepositoryParams = {
    connection: Connection
}
