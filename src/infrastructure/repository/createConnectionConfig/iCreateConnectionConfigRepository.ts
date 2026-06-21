import { Connection } from "../../../domain/entities";

export interface ICreateConnectionConfigRepository {
    save(params: CreateConnectionConfigRepositoryParams): Promise<boolean>;
}

export type CreateConnectionConfigRepositoryParams = {
    connection: Connection
}
