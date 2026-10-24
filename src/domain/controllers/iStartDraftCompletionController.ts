export interface IStartDraftCompletionController {
    handle (request: StartDraftCompletionControllerRequest): Promise<StartDraftCompletionControllerResponse>;
}

export type StartDraftCompletionControllerRequest = {
    draftId: string;
    prompt: string;
};

export type StartDraftCompletionControllerResponse = {
    success: boolean;
    error?: string;
};
