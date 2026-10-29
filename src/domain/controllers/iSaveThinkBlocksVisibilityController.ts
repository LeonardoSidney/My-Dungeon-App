export interface ISaveThinkBlocksVisibilityController {
    handle (request: SaveThinkBlocksVisibilityControllerRequest): Promise<SaveThinkBlocksVisibilityControllerResponse>;
}

export type SaveThinkBlocksVisibilityControllerRequest = {
    showThinkBlocks: boolean;
};

export type SaveThinkBlocksVisibilityControllerResponse = {
    success: boolean;
    showThinkBlocks?: boolean;
    error?: string;
};
