import { SystemPrompt } from '../entities';

export interface ICreateSystemPromptController {
    handle(request: CreateSystemPromptRequest): Promise<CreateSystemPromptResponse>;
}

export type CreateSystemPromptRequest = {
    name: string;
    content: string;
    observation?: string;
};

export type CreateSystemPromptResponse = {
    success: boolean;
    systemPrompt?: SystemPrompt;
    error?: string;
};
