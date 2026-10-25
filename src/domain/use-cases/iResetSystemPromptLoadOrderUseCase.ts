export interface IResetSystemPromptLoadOrderUseCase {
    execute (): Promise<ResetSystemPromptLoadOrderUseCaseReturn>;
}

export type ResetSystemPromptLoadOrderUseCaseReturn = {
    success: boolean;
    loadOrder?: string;
    error?: string;
};
