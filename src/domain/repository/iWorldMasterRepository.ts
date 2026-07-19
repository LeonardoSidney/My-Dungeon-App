import { WorldMaster } from '../entities';

export interface IWorldMasterRepository {
    saveWorldMaster (params: SaveWorldMasterParams): Promise<boolean>;
    getWorldMasters (): Promise<WorldMaster[]>;
    editWorldMaster (params: EditWorldMasterParams): Promise<EditWorldMasterReturn>;
    eraseWorldMaster (worldMasterId: string): Promise<EraseWorldMasterReturn>;
}

export type SaveWorldMasterParams = {
    worldMaster: WorldMaster;
};

export type EditWorldMasterParams = {
    worldMaster: WorldMaster;
};

export type EditWorldMasterReturn = {
    success: boolean;
    error?: string;
};

export type EraseWorldMasterReturn = {
    success: boolean;
    error?: string;
};
