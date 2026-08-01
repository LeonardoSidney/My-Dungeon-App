export interface IEraseSystemPromptController {
    handle (systemPromptId: string): Promise<EraseSystemPromptControllerResponse>;
}

export type EraseSystemPromptControllerParams = string;

export type EraseSystemPromptControllerResponse = {
    success: boolean;
    error?: string;
};
