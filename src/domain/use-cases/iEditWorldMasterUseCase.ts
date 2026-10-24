import { WorldMasterEditParams } from '../services';

export interface IEditWorldMasterUseCase {
    execute (request: EditWorldMasterParams): Promise<EditWorldMasterReturn>;
}

export type EditWorldMasterParams = {
    id: string;
    editParams: WorldMasterEditParams;
};

export type EditWorldMasterReturn = {
    id?: string;
    success: boolean;
    error?: string;
};
