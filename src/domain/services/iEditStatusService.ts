import { Status } from '../entities';

export interface IEditStatusService {
    editStatus (params: EditStatusServiceParams): EditStatusServiceReturn;
}

export type EditStatusServiceParams = {
    status: Status;
};

export type EditStatusServiceReturn = {
    status?: Status;
    success: boolean;
    error?: string;
};
