export interface IContinueFromChatController {
    handle (request: ContinueFromChatControllerRequest): Promise<ContinueFromChatControllerResponse>;
}

export type ContinueFromChatControllerRequest = {
    adventureId: string;
    chatId: string;
};

export type ContinueFromChatControllerResponse = {
    success: boolean;
    error?: string;
};
