import { Status } from '../entities';

export interface IStatusRepository {
    saveStatus(params: SaveStatusParams): Promise<boolean>;
    getStatuses(): Promise<Status[]>;
}

export type SaveStatusParams = {
    status: Status;
};
