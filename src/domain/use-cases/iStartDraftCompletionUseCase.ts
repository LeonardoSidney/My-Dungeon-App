import { Draft } from '../entities';

export interface IStartDraftCompletionUseCase {
    execute (params: StartDraftCompletionUseCaseParams): Promise<StartDraftCompletionUseCaseReturn>;
}

export type StartDraftCompletionUseCaseParams = {
    draftId: string;
    prompt: string;
};

export type StartDraftCompletionUseCaseReturn = {
    success: boolean;
    error?: string;
};

export type DraftCompletionSession = {
    draftId: string;
    prompt: string;
    draft: Draft;
    tokens: AsyncIterable<string>;
    isAborted: () => boolean;
};

export type DraftCompletionOutcome = {
    error?: string;
};
