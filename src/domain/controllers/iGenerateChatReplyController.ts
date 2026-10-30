export interface IGenerateChatReplyController {
    handle (request: GenerateChatReplyControllerRequest): Promise<GenerateChatReplyControllerResponse>;
}

export type GenerateChatReplyControllerRequest = {
    adventureId: string;
    chatId?: string;
    skipPlayerTurn?: boolean;
};

export type GenerateChatReplyControllerResponse = {
    success: boolean;
    chatId?: string;
    error?: string;
};
