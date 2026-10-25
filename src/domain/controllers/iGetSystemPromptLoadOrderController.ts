export interface IGetSystemPromptLoadOrderController {
    handle (): Promise<GetSystemPromptLoadOrderControllerResponse>;
}

export type GetSystemPromptLoadOrderControllerResponse = {
    success: boolean;
    loadOrder?: string;
    error?: string;
};
