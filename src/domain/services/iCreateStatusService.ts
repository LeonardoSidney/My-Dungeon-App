import { Status } from "../entities/Status";

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
