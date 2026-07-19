import { Assistant, Model, Sampler } from '../entities';

export interface IEditAssistantUseCase {
    execute (request: EditAssistantParams): Promise<EditAssistantReturn>;
}

export type EditAssistantParams = {
    id: string;
    name: string;
    observation?: string;
    model: Model;
    sampler: Sampler;
    createdAt: Date;
};

export type EditAssistantReturn = {
    assistant?: Assistant;
    success: boolean;
    error?: string;
};
