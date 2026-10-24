export interface IGetAdventureSystemPromptUseCase {
    execute (params: GetAdventureSystemPromptUseCaseParams): Promise<GetAdventureSystemPromptUseCaseResponse>;
}

export type GetAdventureSystemPromptUseCaseParams = {
    adventureId: string;
};

export type GetAdventureSystemPromptUseCaseResponse = {
    success: boolean;
    systemPrompt?: string;
    error?: string;
};
