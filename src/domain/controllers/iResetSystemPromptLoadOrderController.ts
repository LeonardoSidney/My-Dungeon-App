export interface IResetSystemPromptLoadOrderController {
    handle (): Promise<ResetSystemPromptLoadOrderControllerResponse>;
}

export type ResetSystemPromptLoadOrderControllerResponse = {
    success: boolean;
    loadOrder?: string;
    error?: string;
};
