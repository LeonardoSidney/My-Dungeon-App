import { Assistant, WorldMaster } from '../entities';

export interface IEditWorldMasterService {
    editWorldMaster (request: EditWorldMasterServiceParams): EditWorldMasterServiceReturn;
}

export type EditWorldMasterServiceParams = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistant: Assistant;
    createdAt: Date;
};

export type EditWorldMasterServiceReturn = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
