import { Assistant } from '../entities';

export interface IEditAssistantUseCase {
    execute (request: EditAssistantParams): Promise<EditAssistantReturn>;
}

export type EditAssistantParams = {
    id: string;
    name: string;
    observation?: string;
    modelId: string;
    samplerId: string;
    connectionId: string;
    createdAt: Date;
};

export type EditAssistantReturn = {
    assistant?: Assistant;
    success: boolean;
    error?: string;
};
