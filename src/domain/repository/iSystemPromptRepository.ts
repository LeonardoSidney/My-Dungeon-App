import { SystemPrompt } from '../entities';

export interface ISystemPromptRepository {
    saveSystemPrompt (params: SaveSystemPromptParams): Promise<SaveSystemPromptRepositoryReturn>;
    getSystemPrompts (): Promise<GetSystemPromptsRepositoryReturn>;
    getSystemPromptById (systemPromptId: string): Promise<GetSystemPromptByIdRepositoryReturn>;
    editSystemPrompt (params: EditSystemPromptParams): Promise<EditSystemPromptReturn>;
    eraseSystemPrompt (systemPromptId: string): Promise<EraseSystemPromptReturn>;
}

export type SaveSystemPromptParams = {
    systemPrompt: SystemPrompt;
};

export type EditSystemPromptParams = {
    systemPrompt: SystemPrompt;
};

export type SaveSystemPromptRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetSystemPromptsRepositoryReturn = {
    success: boolean;
    systemPrompts?: SystemPrompt[];
    error?: string;
};

export type GetSystemPromptByIdRepositoryReturn = {
    success: boolean;
    systemPrompt?: SystemPrompt;
    error?: string;
};

export type EditSystemPromptReturn = {
    success: boolean;
    error?: string;
};

export type EraseSystemPromptReturn = {
    success: boolean;
    error?: string;
};
