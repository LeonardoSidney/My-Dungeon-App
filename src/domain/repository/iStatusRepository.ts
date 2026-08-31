import { Status } from '../entities';

export interface IStatusRepository {
    saveStatus (params: SaveStatusParams): Promise<boolean>;
    getStatuses (): Promise<Status[]>;
    getStatusById (statusId: string): Promise<Status | undefined>;
    editStatus (params: EditStatusParams): Promise<EditStatusReturn>;
    eraseStatus (statusId: string): Promise<EraseStatusReturn>;
}

export type SaveStatusParams = {
    status: Status;
};

export type EditStatusParams = {
    status: Status;
};

export type EditStatusReturn = {
    success: boolean;
    error?: string;
};

export type EraseStatusReturn = {
    success: boolean;
    error?: string;
};
