export const DEFAULT_SHOW_THINK_BLOCKS = true;

export interface IGetThinkBlocksVisibilityUseCase {
    execute (): Promise<GetThinkBlocksVisibilityUseCaseReturn>;
}

export type GetThinkBlocksVisibilityUseCaseReturn = {
    success: boolean;
    showThinkBlocks?: boolean;
    error?: string;
};
