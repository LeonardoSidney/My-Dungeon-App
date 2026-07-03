import { Assistant, WorldMaster } from '../entities';

export interface ICreateWorldMasterController {
    handle(params: CreateWorldMasterControllerParams): Promise<CreateWorldMasterControllerResponse>;
}

export type CreateWorldMasterControllerParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistant: Assistant;
};

export type CreateWorldMasterControllerResponse = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
