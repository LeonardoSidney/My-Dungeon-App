import { Status } from '../entities';

export interface ICreateStatusController {
    handle(params: CreateStatusControllerParams): Promise<CreateStatusControllerResponse>;
}

export type CreateStatusControllerParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateStatusControllerResponse = {
    success: boolean;
    status?: Status;
    error?: string;
};
