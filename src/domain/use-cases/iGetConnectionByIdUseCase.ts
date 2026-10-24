import { Connection } from '../entities';

export interface IGetConnectionByIdUseCase {
    execute (params: GetConnectionByIdUseCaseParams): Promise<GetConnectionByIdUseCaseReturn>;
}

export type GetConnectionByIdUseCaseParams = {
    id: string;
};

export type GetConnectionByIdUseCaseReturn = {
    success: boolean;
    connection?: Connection;
    error?: string;
};
