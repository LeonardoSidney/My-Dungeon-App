import { Status } from '../entities';

export interface IEditStatusUseCase {
    execute (request: EditStatusParams): Promise<EditStatusReturn>;
}

export type EditStatusParams = {
    status: Status;
};

export type EditStatusReturn = {
    status?: Status;
    success: boolean;
    error?: string;
};
