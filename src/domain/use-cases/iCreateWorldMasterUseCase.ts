import { WorldMaster } from '../entities';

export interface ICreateWorldMasterUseCase {
    execute (params: CreateWorldMasterUseCaseParams): Promise<CreateWorldMasterUseCaseResponse>;
}

export type CreateWorldMasterUseCaseParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistantId: string;
};

export type CreateWorldMasterUseCaseResponse = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
