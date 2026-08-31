import { WorldMaster } from '../entities';

export interface IEditWorldMasterService {
    editWorldMaster (request: EditWorldMasterServiceParams): EditWorldMasterServiceReturn;
}

export type EditWorldMasterServiceParams = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistantId: string;
    createdAt: Date;
};

export type EditWorldMasterServiceReturn = {
    success: boolean;
    worldMaster?: WorldMaster;
    error?: string;
};
