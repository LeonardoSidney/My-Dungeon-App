export interface ISubscribeChatReplyController {
    handle (request: SubscribeChatReplyControllerRequest): SubscribeChatReplyControllerResponse;
}

export type ChatReplyUpdateView = {
    chatId: string;
    isFinished: boolean;
    isRemoved: boolean;
    error?: string;
};

export type SubscribeChatReplyControllerRequest = {
    adventureId: string;
    onUpdate: (update: ChatReplyUpdateView) => void;
};

export type SubscribeChatReplyControllerResponse = {
    success: boolean;
    isReplying?: boolean;
    unsubscribe?: () => void;
    error?: string;
};
