export interface IStopChatReplyController {
    handle (request: StopChatReplyControllerRequest): StopChatReplyControllerResponse;
}

export type StopChatReplyControllerRequest = {
    adventureId: string;
};

export type StopChatReplyControllerResponse = {
    success: boolean;
    error?: string;
};
