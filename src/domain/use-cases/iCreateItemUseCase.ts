
export interface ICreateItemUseCase {
    execute(request: CreateItemUseCaseParams): Promise<CreateItemUseCaseResponse>;
}

export type CreateItemUseCaseParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateItemUseCaseResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
