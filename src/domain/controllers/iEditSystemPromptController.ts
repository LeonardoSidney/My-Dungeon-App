import { SystemPrompt } from '../entities';
import { SystemPromptEditParams } from '../services';

export interface IEditSystemPromptController {
    handle (params: EditSystemPromptControllerParams): Promise<EditSystemPromptControllerResponse>;
}

export type EditSystemPromptControllerParams = {
    id: string;
    editParams: SystemPromptEditParams;
};

export type EditSystemPromptControllerResponse = {
    systemPrompt?: SystemPrompt;
    success: boolean;
    error?: string;
};
