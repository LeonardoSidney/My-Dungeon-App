import { SystemPrompt } from '../entities';

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
    systemPrompt?: SystemPrompt;
    error?: string;
};
