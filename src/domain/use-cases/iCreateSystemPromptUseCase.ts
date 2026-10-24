
export interface ICreateSystemPromptUseCase {
    execute(request: CreateSystemPromptUseCaseParams): Promise<CreateSystemPromptUseCaseResponse>;
}

export type CreateSystemPromptUseCaseParams = {
    name: string;
    content: string;
    observation?: string;
};

export type CreateSystemPromptUseCaseResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
