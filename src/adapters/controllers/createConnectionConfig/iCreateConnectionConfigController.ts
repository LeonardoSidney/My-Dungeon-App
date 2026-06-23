import { Connection } from "../../../domain/entities";

export interface ICreateConnectionConfigController {
    handle(request: CreateConnectionConfigControllerRequest): Promise<CreateConnectionConfigControllerResponse>;
}

export type CreateConnectionConfigControllerRequest = {
    name: string;
    ip: string;
    port?: number;
    auth?: string;
};

export type CreateConnectionConfigControllerResponse = {
    success: boolean;
    connection?: Connection;
    error?: string;
};
