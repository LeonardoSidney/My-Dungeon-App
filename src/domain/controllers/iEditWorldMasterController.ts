import { Assistant, WorldMaster } from '../entities';

export type EditWorldMasterControllerRequest = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistant: Assistant;
    createdAt: Date;
};

export type EditWorldMasterControllerResponse = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};

export interface IEditWorldMasterController {
    handle (request: EditWorldMasterControllerRequest): Promise<EditWorldMasterControllerResponse>;
}
