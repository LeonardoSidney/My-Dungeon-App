import { SystemPromptEditParams } from '../services';

export interface IEditSystemPromptUseCase {
    execute (request: EditSystemPromptParams): Promise<EditSystemPromptReturn>;
}

export type EditSystemPromptParams = {
    id: string;
    editParams: SystemPromptEditParams;
};

export type EditSystemPromptReturn = {
    id?: string;
    success: boolean;
    error?: string;
};
