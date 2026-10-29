export interface ISaveThinkBlocksVisibilityUseCase {
    execute (params: SaveThinkBlocksVisibilityUseCaseParams): Promise<SaveThinkBlocksVisibilityUseCaseReturn>;
}

export type SaveThinkBlocksVisibilityUseCaseParams = {
    showThinkBlocks: boolean;
};

export type SaveThinkBlocksVisibilityUseCaseReturn = {
    success: boolean;
    showThinkBlocks?: boolean;
    error?: string;
};
