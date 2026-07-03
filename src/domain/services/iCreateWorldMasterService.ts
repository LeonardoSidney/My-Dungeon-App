import { Assistant, WorldMaster } from '../entities';

export interface ICreateWorldMasterService {
    createWorldMaster(params: CreateWorldMasterServiceParams): CreateWorldMasterServiceResponse;
}

export type CreateWorldMasterServiceParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistant: Assistant;
};

export type CreateWorldMasterServiceResponse = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
