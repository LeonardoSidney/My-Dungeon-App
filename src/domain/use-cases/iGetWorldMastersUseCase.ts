import { WorldMaster } from '../entities';

export interface IGetWorldMastersUseCase {
    execute (): Promise<GetWorldMastersUseCaseReturn>;
}

export type GetWorldMastersUseCaseReturn = {
    success: boolean;
    worldMasters?: WorldMaster[];
    error?: string;
};
