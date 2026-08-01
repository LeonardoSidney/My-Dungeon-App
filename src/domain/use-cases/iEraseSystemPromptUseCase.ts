export type EraseSystemPromptUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseSystemPromptUseCase {
    execute (systemPromptId: string): Promise<EraseSystemPromptUseCaseReturn>;
}
