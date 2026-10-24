export interface IResendChatController {
    handle (request: ResendChatControllerRequest): Promise<ResendChatControllerResponse>;
}

export type ResendChatControllerRequest = {
    adventureId: string;
};

export type ResendChatControllerResponse = {
    success: boolean;
    error?: string;
};
