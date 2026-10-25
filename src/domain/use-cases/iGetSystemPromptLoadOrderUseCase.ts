export interface IGetSystemPromptLoadOrderUseCase {
    execute (): Promise<GetSystemPromptLoadOrderUseCaseReturn>;
}

export type GetSystemPromptLoadOrderUseCaseReturn = {
    success: boolean;
    loadOrder?: string;
    error?: string;
};
