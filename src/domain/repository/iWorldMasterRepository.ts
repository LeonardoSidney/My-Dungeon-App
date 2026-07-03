import { WorldMaster } from '../entities';

export interface IWorldMasterRepository {
    saveWorldMaster(params: SaveWorldMasterParams): Promise<boolean>;
    getWorldMasters(): Promise<WorldMaster[]>;
}

export type SaveWorldMasterParams = {
    worldMaster: WorldMaster;
};
