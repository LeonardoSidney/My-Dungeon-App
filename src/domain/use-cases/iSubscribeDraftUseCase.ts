import { KeyedEventListener, DraftEvent } from '../providers';

export interface ISubscribeDraftUseCase {
    execute (params: SubscribeDraftUseCaseParams): SubscribeDraftUseCaseReturn;
}

export type SubscribeDraftUseCaseParams = {
    draftId: string;
    listener: KeyedEventListener<DraftEvent>;
};

export type SubscribeDraftUseCaseReturn = {
    success: boolean;
    isStreaming?: boolean;
    unsubscribe?: () => void;
    error?: string;
};
