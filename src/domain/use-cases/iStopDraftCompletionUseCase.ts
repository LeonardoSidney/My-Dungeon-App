export interface IStopDraftCompletionUseCase {
    execute (params: StopDraftCompletionUseCaseParams): StopDraftCompletionUseCaseReturn;
}

export type StopDraftCompletionUseCaseParams = {
    draftId: string;
};

export type StopDraftCompletionUseCaseReturn = {
    success: boolean;
    error?: string;
};
