
export interface ICreateProficiencyUseCase {
    execute(params: CreateProficiencyUseCaseParams): Promise<CreateProficiencyUseCaseResponse>;
}

export type CreateProficiencyUseCaseParams = {
    name: string;
    prompt: string;
    activationWord: string;
    observation?: string;
};

export type CreateProficiencyUseCaseResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
