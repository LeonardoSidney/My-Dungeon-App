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
    id?: string,
    success: boolean,
    error?: string;
};
