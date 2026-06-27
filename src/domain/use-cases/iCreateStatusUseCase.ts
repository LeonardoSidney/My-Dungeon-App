import { Status } from "../entities/Status";

export interface ICreateStatusUseCase {
    execute(params: CreateStatusUseCaseParams): Promise<CreateStatusUseCaseResponse>;
}

export type CreateStatusUseCaseParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateStatusUseCaseResponse = {
    success: boolean;
    status?: Status;
    error?: string;
};
