import { SystemPrompt } from '../entities';

export interface IGetSystemPromptsUseCase {
    execute (): Promise<GetSystemPromptsUseCaseReturn>;
}

export type GetSystemPromptsUseCaseReturn = {
    success: boolean;
    systemPrompts?: SystemPrompt[];
    error?: string;
};
