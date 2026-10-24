import { Status } from '../entities';

export interface IStatusRepository {
    saveStatus (params: SaveStatusParams): Promise<SaveStatusRepositoryReturn>;
    getStatuses (): Promise<GetStatusesRepositoryReturn>;
    getStatusById (statusId: string): Promise<GetStatusByIdRepositoryReturn>;
    editStatus (params: EditStatusParams): Promise<EditStatusReturn>;
    eraseStatus (statusId: string): Promise<EraseStatusReturn>;
}

export type SaveStatusParams = {
    status: Status;
};

export type EditStatusParams = {
    status: Status;
};

export type SaveStatusRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetStatusesRepositoryReturn = {
    success: boolean;
    statuses?: Status[];
    error?: string;
};

export type GetStatusByIdRepositoryReturn = {
    success: boolean;
    status?: Status;
    error?: string;
};

export type EditStatusReturn = {
    success: boolean;
    error?: string;
};

export type EraseStatusReturn = {
    success: boolean;
    error?: string;
};
