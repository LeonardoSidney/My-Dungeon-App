
export interface ICreateLocationUseCase {
    execute(request: CreateLocationUseCaseParams): Promise<CreateLocationUseCaseResponse>;
}

export type CreateLocationUseCaseParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateLocationUseCaseResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
