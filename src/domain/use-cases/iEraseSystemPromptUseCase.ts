export type EraseSystemPromptUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseSystemPromptUseCase {
    execute (params: EraseSystemPromptUseCaseParams): Promise<EraseSystemPromptUseCaseReturn>;
}

export type EraseSystemPromptUseCaseParams = {
    id: string;
};
