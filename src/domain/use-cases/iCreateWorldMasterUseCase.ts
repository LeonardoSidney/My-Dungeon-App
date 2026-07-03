import { Assistant, WorldMaster } from '../entities';

export interface ICreateWorldMasterUseCase {
    execute(params: CreateWorldMasterUseCaseParams): Promise<CreateWorldMasterUseCaseResponse>;
}

export type CreateWorldMasterUseCaseParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistant: Assistant;
};

export type CreateWorldMasterUseCaseResponse = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
