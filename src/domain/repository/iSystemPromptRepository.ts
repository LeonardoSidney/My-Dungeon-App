import { SystemPrompt } from '../entities';

export interface ISystemPromptRepository {
    saveSystemPrompt(params: SaveSystemPromptParams): Promise<boolean>;
    getSystemPrompts(): Promise<SystemPrompt[]>;
}

export type SaveSystemPromptParams = {
    systemPrompt: SystemPrompt;
};
