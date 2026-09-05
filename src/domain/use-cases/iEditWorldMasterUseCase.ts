import { WorldMaster } from '../entities';
import { WorldMasterEditParams } from '../services';

export interface IEditWorldMasterUseCase {
    execute (request: EditWorldMasterParams): Promise<EditWorldMasterReturn>;
}

export type EditWorldMasterParams = {
    id: string;
    editParams: WorldMasterEditParams;
};

export type EditWorldMasterReturn = {
    worldMaster?: WorldMaster;
    success: boolean;
    error?: string;
};
