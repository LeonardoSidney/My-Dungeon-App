import { WorldMaster } from '../entities';
import { WorldMasterEditParams } from '../services';

export type EditWorldMasterControllerParams = {
    id: string;
    editParams: WorldMasterEditParams;
};

export type EditWorldMasterControllerResponse = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};

export interface IEditWorldMasterController {
    handle (params: EditWorldMasterControllerParams): Promise<EditWorldMasterControllerResponse>;
}
