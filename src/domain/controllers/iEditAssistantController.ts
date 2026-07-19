import { Assistant, Model, Sampler } from '../entities';

export interface IEditAssistantController {
    handle (params: EditAssistantControllerParams): Promise<EditAssistantControllerResponse>;
}

export type EditAssistantControllerParams = {
    id: string;
    name: string;
    observation?: string;
    model: Model;
    sampler: Sampler;
    createdAt: Date;
};

export type EditAssistantControllerResponse = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
