
export interface ICreateAssistantController {
    handle (params: CreateAssistantControllerParams): Promise<CreateAssistantControllerResponse>;
}

export type CreateAssistantControllerParams = {
    name: string;
    observation?: string;
    modelId: string;
    samplerId: string;
    connectionId: string;
};

export type CreateAssistantControllerResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
