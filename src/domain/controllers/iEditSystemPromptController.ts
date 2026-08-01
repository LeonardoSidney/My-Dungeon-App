import { SystemPrompt } from '../entities';

export interface IEditSystemPromptController {
    handle (params: EditSystemPromptControllerParams): Promise<EditSystemPromptControllerResponse>;
}

export type EditSystemPromptControllerParams = {
    systemPrompt: SystemPrompt;
};

export type EditSystemPromptControllerResponse = {
    systemPrompt?: SystemPrompt;
    success: boolean;
    error?: string;
};
