import { Connection } from "../../../domain/entities";

export interface ICreateConnectionConfigUseCase {
    execute(request: CreateConnectionConfigParams): Promise<CreateConnectionConfigReturn>;
}

export type CreateConnectionConfigParams = {
    name: string,
    ip: string,
    port?: number,
    auth?: string
};

export type CreateConnectionConfigReturn = {
    connection: Connection
};
