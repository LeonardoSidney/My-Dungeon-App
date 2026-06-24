import { Assistant, Model, Sampler } from "../entities";

export interface ICreateAssistantUseCase {
    execute(params: CreateAssistantUseCaseParams): Promise<CreateAssistantUseCaseResponse>;
}

export type CreateAssistantUseCaseParams = {
    name: string;
    observation?: string;
    model: Model;
    sampler: Sampler;
};

export type CreateAssistantUseCaseResponse = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
