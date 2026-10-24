
export interface ICreateWorldMasterUseCase {
    execute (params: CreateWorldMasterUseCaseParams): Promise<CreateWorldMasterUseCaseResponse>;
}

export type CreateWorldMasterUseCaseParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistantId: string;
};

export type CreateWorldMasterUseCaseResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
