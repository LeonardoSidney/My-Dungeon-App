import type { ChatMessageView } from './iChatMessageView';

export interface IGetChatMessageController {
    handle (params: GetChatMessageControllerParams): Promise<GetChatMessageControllerResponse>;
}

export type GetChatMessageControllerParams = {
    adventureId: string;
    chatId: string;
};

export type GetChatMessageControllerResponse = {
    success: boolean;
    message?: ChatMessageView;
    error?: string;
};
