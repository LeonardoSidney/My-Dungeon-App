import { Status } from '../entities';
export interface ICreateStatusService {
    createStatus(params: CreateStatusServiceParams): CreateStatusServiceReturn;
}

export type CreateStatusServiceParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateStatusServiceReturn = {
    success: boolean;
    status?: Status;
    error?: string;
};
