import { SystemPrompt } from '../entities';

export interface IGetSystemPromptByIdUseCase {
    execute (params: GetSystemPromptByIdUseCaseParams): Promise<GetSystemPromptByIdUseCaseReturn>;
}

export type GetSystemPromptByIdUseCaseParams = {
    id: string;
};

export type GetSystemPromptByIdUseCaseReturn = {
    success: boolean;
    systemPrompt?: SystemPrompt;
    error?: string;
};
