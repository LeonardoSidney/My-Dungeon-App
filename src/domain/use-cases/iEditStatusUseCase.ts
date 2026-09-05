import { Status } from '../entities';
import { StatusEditParams } from '../services';

export interface IEditStatusUseCase {
    execute (request: EditStatusParams): Promise<EditStatusReturn>;
}

export type EditStatusParams = {
    id: string;
    editParams: StatusEditParams;
};

export type EditStatusReturn = {
    status?: Status;
    success: boolean;
    error?: string;
};
