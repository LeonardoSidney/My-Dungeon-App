import { Status } from '../entities';

export interface IEditStatusController {
    handle (params: EditStatusControllerParams): Promise<EditStatusControllerResponse>;
}

export type EditStatusControllerParams = {
    status: Status;
};

export type EditStatusControllerResponse = {
    status?: Status;
    success: boolean;
    error?: string;
};
