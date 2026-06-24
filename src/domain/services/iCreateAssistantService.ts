import { Assistant, Model, Sampler } from "../entities";

export interface ICreateAssistantService {
    createAssistant(params: CreateAssistantServiceParams): Promise<CreateAssistantServiceResponse>;
}

export type CreateAssistantServiceParams = {
    name: string;
    observation?: string;
    model: Model;
    sampler: Sampler;
};

export type CreateAssistantServiceResponse = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
