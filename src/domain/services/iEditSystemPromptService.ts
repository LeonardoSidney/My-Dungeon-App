import { SystemPrompt } from '../entities';

export type SystemPromptEditParams = Omit<SystemPrompt, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEditSystemPromptService {
    editSystemPrompt (params: EditSystemPromptServiceParams): EditSystemPromptServiceReturn;
}

export type EditSystemPromptServiceParams = {
    systemPrompt: SystemPrompt;
    editParams: SystemPromptEditParams;
};

export type EditSystemPromptServiceReturn = {
    systemPrompt?: SystemPrompt;
    success: boolean;
    error?: string;
};
