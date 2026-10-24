import type { DraftUpdateView } from './iDraftView';

export interface ISubscribeDraftController {
    handle (request: SubscribeDraftControllerRequest): SubscribeDraftControllerResponse;
}

export type SubscribeDraftControllerRequest = {
    draftId: string;
    onUpdate: (update: DraftUpdateView) => void;
};

export type SubscribeDraftControllerResponse = {
    success: boolean;
    isStreaming?: boolean;
    unsubscribe?: () => void;
    error?: string;
};
