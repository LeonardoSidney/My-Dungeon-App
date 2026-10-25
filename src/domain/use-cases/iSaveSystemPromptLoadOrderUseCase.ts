export interface ISaveSystemPromptLoadOrderUseCase {
    execute (params: SaveSystemPromptLoadOrderUseCaseParams): Promise<SaveSystemPromptLoadOrderUseCaseReturn>;
}

export type SaveSystemPromptLoadOrderUseCaseParams = {
    loadOrder: string;
};

export type SaveSystemPromptLoadOrderUseCaseReturn = {
    success: boolean;
    loadOrder?: string;
    error?: string;
};
