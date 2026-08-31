import { Assistant } from '../entities';

export interface ICreateAssistantUseCase {
    execute (params: CreateAssistantUseCaseParams): Promise<CreateAssistantUseCaseResponse>;
}

export type CreateAssistantUseCaseParams = {
    name: string;
    observation?: string;
    modelId: string;
    samplerId: string;
    connectionId: string;
};

export type CreateAssistantUseCaseResponse = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
