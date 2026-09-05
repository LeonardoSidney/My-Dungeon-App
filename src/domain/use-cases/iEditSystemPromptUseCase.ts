import { SystemPrompt } from '../entities';
import { SystemPromptEditParams } from '../services';

export interface IEditSystemPromptUseCase {
    execute (request: EditSystemPromptParams): Promise<EditSystemPromptReturn>;
}

export type EditSystemPromptParams = {
    id: string;
    editParams: SystemPromptEditParams;
};

export type EditSystemPromptReturn = {
    systemPrompt?: SystemPrompt;
    success: boolean;
    error?: string;
};
