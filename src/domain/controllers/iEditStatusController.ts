import { Status } from '../entities';
import { StatusEditParams } from '../services';

export interface IEditStatusController {
    handle (params: EditStatusControllerParams): Promise<EditStatusControllerResponse>;
}

export type EditStatusControllerParams = {
    id: string;
    editParams: StatusEditParams;
};

export type EditStatusControllerResponse = {
    status?: Status;
    success: boolean;
    error?: string;
};
