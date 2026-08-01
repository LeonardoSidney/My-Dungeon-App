import { SystemPrompt } from '../entities';

export interface IEditSystemPromptUseCase {
    execute (request: EditSystemPromptParams): Promise<EditSystemPromptReturn>;
}

export type EditSystemPromptParams = {
    systemPrompt: SystemPrompt;
};

export type EditSystemPromptReturn = {
    systemPrompt?: SystemPrompt;
    success: boolean;
    error?: string;
};
