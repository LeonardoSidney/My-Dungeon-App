export interface IEraseSystemPromptController {
    handle (systemPromptId: string): Promise<EraseSystemPromptControllerResponse>;
}

export type EraseSystemPromptControllerResponse = {
    success: boolean;
    error?: string;
};
