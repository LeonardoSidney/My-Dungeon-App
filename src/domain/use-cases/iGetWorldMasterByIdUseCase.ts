import { WorldMaster } from '../entities';

export interface IGetWorldMasterByIdUseCase {
    execute (params: GetWorldMasterByIdUseCaseParams): Promise<GetWorldMasterByIdUseCaseReturn>;
}

export type GetWorldMasterByIdUseCaseParams = {
    id: string;
};

export type GetWorldMasterByIdUseCaseReturn = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
