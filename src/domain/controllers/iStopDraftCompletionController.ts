export interface IStopDraftCompletionController {
    handle (request: StopDraftCompletionControllerRequest): StopDraftCompletionControllerResponse;
}

export type StopDraftCompletionControllerRequest = {
    draftId: string;
};

export type StopDraftCompletionControllerResponse = {
    success: boolean;
    error?: string;
};
