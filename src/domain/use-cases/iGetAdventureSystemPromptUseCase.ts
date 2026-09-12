import { Adventure } from '../entities';

export interface IGetAdventureSystemPromptUseCase {
    execute (params: GetAdventureSystemPromptUseCaseParams): Promise<GetAdventureSystemPromptUseCaseResponse>;
}

export type GetAdventureSystemPromptUseCaseParams = {
    adventure: Adventure;
};

export type GetAdventureSystemPromptUseCaseResponse = {
    success: boolean;
    systemPrompt?: string;
    error?: string;
};
