
export interface ICreateAbilityUseCase {
    execute(params: CreateAbilityUseCaseParams): Promise<CreateAbilityUseCaseResponse>;
}

export type CreateAbilityUseCaseParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateAbilityUseCaseResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
