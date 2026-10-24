import { Status } from '../entities';

export interface IGetStatusByIdUseCase {
    execute (params: GetStatusByIdUseCaseParams): Promise<GetStatusByIdUseCaseReturn>;
}

export type GetStatusByIdUseCaseParams = {
    id: string;
};

export type GetStatusByIdUseCaseReturn = {
    success: boolean;
    status?: Status;
    error?: string;
};
