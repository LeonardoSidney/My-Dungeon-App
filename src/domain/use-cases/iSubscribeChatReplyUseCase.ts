import { ChatReplyListener } from '../providers';

export interface ISubscribeChatReplyUseCase {
    execute (params: SubscribeChatReplyUseCaseParams): SubscribeChatReplyUseCaseReturn;
}

export type SubscribeChatReplyUseCaseParams = {
    adventureId: string;
    listener: ChatReplyListener;
};

export type SubscribeChatReplyUseCaseReturn = {
    success: boolean;
    isReplying?: boolean;
    unsubscribe?: () => void;
    error?: string;
};
