import { Assistant } from '../entities';

export interface ICreateAssistantService {
    createAssistant (params: CreateAssistantServiceParams): Promise<CreateAssistantServiceResponse>;
}

export type CreateAssistantServiceParams = {
    name: string;
    observation?: string;
    modelId: string;
    samplerId: string;
    connectionId: string;
};

export type CreateAssistantServiceResponse = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
