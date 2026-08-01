import { SystemPrompt } from '../entities';

export interface ISystemPromptRepository {
    saveSystemPrompt(params: SaveSystemPromptParams): Promise<boolean>;
    getSystemPrompts(): Promise<SystemPrompt[]>;
    editSystemPrompt(params: EditSystemPromptParams): Promise<EditSystemPromptReturn>;
    eraseSystemPrompt(systemPromptId: string): Promise<EraseSystemPromptReturn>;
}

export type SaveSystemPromptParams = {
    systemPrompt: SystemPrompt;
};

export type EditSystemPromptParams = {
    systemPrompt: SystemPrompt;
};

export type EditSystemPromptReturn = {
    success: boolean;
    error?: string;
};

export type EraseSystemPromptReturn = {
    success: boolean;
    error?: string;
};
