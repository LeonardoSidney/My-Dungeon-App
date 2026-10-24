
export interface ICreateWorldMasterController {
    handle (params: CreateWorldMasterControllerParams): Promise<CreateWorldMasterControllerResponse>;
}

export type CreateWorldMasterControllerParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistantId: string;
};

export type CreateWorldMasterControllerResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
