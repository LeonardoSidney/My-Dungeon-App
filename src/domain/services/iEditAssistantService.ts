import { Assistant, Model, Sampler } from '../entities';

export interface IEditAssistantService {
    editAssistant (request: EditAssistantServiceParams): EditAssistantServiceReturn;
}

export type EditAssistantServiceParams = {
    id: string;
    name: string;
    observation?: string;
    model: Model;
    sampler: Sampler;
    createdAt: Date;
};

export type EditAssistantServiceReturn = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
