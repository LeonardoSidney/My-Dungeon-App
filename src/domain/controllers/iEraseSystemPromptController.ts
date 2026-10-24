export interface IEraseSystemPromptController {
    handle (request: EraseSystemPromptControllerRequest): Promise<EraseSystemPromptControllerResponse>;
}

export type EraseSystemPromptControllerResponse = {
    success: boolean;
    error?: string;
};

export type EraseSystemPromptControllerRequest = {
    id: string;
};
