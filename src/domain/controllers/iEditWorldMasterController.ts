import { WorldMasterEditParams } from '../services';

export type EditWorldMasterControllerParams = {
    id: string;
    editParams: WorldMasterEditParams;
};

export type EditWorldMasterControllerResponse = {
    success: boolean;
    id?: string;
    error?: string;
};

export interface IEditWorldMasterController {
    handle (params: EditWorldMasterControllerParams): Promise<EditWorldMasterControllerResponse>;
}
