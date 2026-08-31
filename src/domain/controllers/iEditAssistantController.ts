import { Assistant } from '../entities';

export interface IEditAssistantController {
    handle (params: EditAssistantControllerParams): Promise<EditAssistantControllerResponse>;
}

export type EditAssistantControllerParams = {
    id: string;
    name: string;
    observation?: string;
    modelId: string;
    samplerId: string;
    connectionId: string;
    createdAt: Date;
};

export type EditAssistantControllerResponse = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
