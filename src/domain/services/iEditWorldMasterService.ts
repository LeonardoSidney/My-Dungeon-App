import { WorldMaster } from '../entities';

export type WorldMasterEditParams = Omit<WorldMaster, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEditWorldMasterService {
    editWorldMaster (request: EditWorldMasterServiceParams): EditWorldMasterServiceReturn;
}

export type EditWorldMasterServiceParams = {
    worldMaster: WorldMaster;
    editParams: WorldMasterEditParams;
};

export type EditWorldMasterServiceReturn = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
