import { WorldMaster } from '../entities';

export interface ICreateWorldMasterController {
    handle (params: CreateWorldMasterControllerParams): Promise<CreateWorldMasterControllerResponse>;
}

export type CreateWorldMasterControllerParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistantId: string;
};

export type CreateWorldMasterControllerResponse = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
