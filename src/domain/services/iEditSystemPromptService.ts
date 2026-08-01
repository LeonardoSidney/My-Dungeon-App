import { SystemPrompt } from '../entities';

export interface IEditSystemPromptService {
    editSystemPrompt (params: EditSystemPromptServiceParams): EditSystemPromptServiceReturn;
}

export type EditSystemPromptServiceParams = {
    systemPrompt: SystemPrompt;
};

export type EditSystemPromptServiceReturn = {
    systemPrompt?: SystemPrompt;
    success: boolean;
    error?: string;
};
