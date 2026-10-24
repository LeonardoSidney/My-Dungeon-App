import { WorldMaster } from '../entities';

export interface IWorldMasterRepository {
    saveWorldMaster (params: SaveWorldMasterParams): Promise<SaveWorldMasterRepositoryReturn>;
    getWorldMasters (): Promise<GetWorldMastersRepositoryReturn>;
    getWorldMasterById (worldMasterId: string): Promise<GetWorldMasterByIdRepositoryReturn>;
    editWorldMaster (params: EditWorldMasterParams): Promise<EditWorldMasterReturn>;
    eraseWorldMaster (worldMasterId: string): Promise<EraseWorldMasterReturn>;
}

export type SaveWorldMasterParams = {
    worldMaster: WorldMaster;
};

export type EditWorldMasterParams = {
    worldMaster: WorldMaster;
};

export type SaveWorldMasterRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetWorldMastersRepositoryReturn = {
    success: boolean;
    worldMasters?: WorldMaster[];
    error?: string;
};

export type GetWorldMasterByIdRepositoryReturn = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};

export type EditWorldMasterReturn = {
    success: boolean;
    error?: string;
};

export type EraseWorldMasterReturn = {
    success: boolean;
    error?: string;
};
