import { Assistant, Model, Sampler } from "../entities";

export interface ICreateAssistantController {
    handle(params: CreateAssistantControllerParams): Promise<CreateAssistantControllerResponse>;
}

export type CreateAssistantControllerParams = {
    name: string;
    observation?: string;
    model: Model;
    sampler: Sampler;
}

export type CreateAssistantControllerResponse = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
}
