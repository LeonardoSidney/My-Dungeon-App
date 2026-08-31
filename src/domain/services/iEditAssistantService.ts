import { Assistant } from '../entities';

export interface IEditAssistantService {
    editAssistant (request: EditAssistantServiceParams): EditAssistantServiceReturn;
}

export type EditAssistantServiceParams = {
    id: string;
    name: string;
    observation?: string;
    modelId: string;
    samplerId: string;
    connectionId: string;
    createdAt: Date;
};

export type EditAssistantServiceReturn = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
