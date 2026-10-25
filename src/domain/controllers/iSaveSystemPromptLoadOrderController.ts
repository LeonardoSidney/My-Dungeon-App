export interface ISaveSystemPromptLoadOrderController {
    handle (request: SaveSystemPromptLoadOrderControllerRequest): Promise<SaveSystemPromptLoadOrderControllerResponse>;
}

export type SaveSystemPromptLoadOrderControllerRequest = {
    loadOrder: string;
};

export type SaveSystemPromptLoadOrderControllerResponse = {
    success: boolean;
    loadOrder?: string;
    error?: string;
};
