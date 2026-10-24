import { WorldMaster } from '../entities';

export interface IGetAdventureWorldMasterUseCase {
    execute (params: GetAdventureWorldMasterUseCaseParams): Promise<GetAdventureWorldMasterUseCaseReturn>;
}

export type GetAdventureWorldMasterUseCaseParams = {
    adventureId: string;
};

export type GetAdventureWorldMasterUseCaseReturn = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
