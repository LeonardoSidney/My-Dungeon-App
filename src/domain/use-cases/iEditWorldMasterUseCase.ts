import { WorldMaster } from '../entities';

export interface IEditWorldMasterUseCase {
    execute (request: EditWorldMasterParams): Promise<EditWorldMasterReturn>;
}

export type EditWorldMasterParams = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistantId: string;
    createdAt: Date;
};

export type EditWorldMasterReturn = {
    worldMaster?: WorldMaster;
    success: boolean;
    error?: string;
};
