export interface IEraseAssistantController {
    handle (assistantId: string): Promise<EraseAssistantControllerResponse>;
}

export type EraseAssistantControllerResponse = {
    success: boolean;
    error?: string;
};
