import { Status } from '../entities';

export type StatusEditParams = Omit<Status, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEditStatusService {
    editStatus (params: EditStatusServiceParams): EditStatusServiceReturn;
}

export type EditStatusServiceParams = {
    status: Status;
    editParams: StatusEditParams;
};

export type EditStatusServiceReturn = {
    status?: Status;
    success: boolean;
    error?: string;
};
