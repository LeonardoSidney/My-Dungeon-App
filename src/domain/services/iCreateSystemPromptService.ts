import { SystemPrompt } from '../entities';

export interface ICreateSystemPromptService {
    createSystemPrompt(params: CreateSystemPromptServiceParams): CreateSystemPromptServiceResponse;
}

export type CreateSystemPromptServiceParams = {
    name: string;
    content: string;
    observation?: string;
};

export type CreateSystemPromptServiceResponse = {
    success: boolean;
    systemPrompt?: SystemPrompt;
    error?: string;
};
