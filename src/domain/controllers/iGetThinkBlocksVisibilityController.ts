export interface IGetThinkBlocksVisibilityController {
    handle (): Promise<GetThinkBlocksVisibilityControllerResponse>;
}

export type GetThinkBlocksVisibilityControllerResponse = {
    success: boolean;
    showThinkBlocks?: boolean;
    error?: string;
};
