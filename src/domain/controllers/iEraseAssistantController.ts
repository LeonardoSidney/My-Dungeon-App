export interface IEraseAssistantController {
    handle (request: EraseAssistantControllerRequest): Promise<EraseAssistantControllerResponse>;
}

export type EraseAssistantControllerResponse = {
    success: boolean;
    error?: string;
};

export type EraseAssistantControllerRequest = {
    id: string;
};
