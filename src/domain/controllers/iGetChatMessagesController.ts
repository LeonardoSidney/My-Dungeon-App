import { ChatMessagesControllerResponse } from './iChatMessagesControllerResponse';

export interface IGetChatMessagesController {
    handle (params: GetChatMessagesControllerParams): Promise<GetChatMessagesControllerResponse>;
}

export type GetChatMessagesControllerParams = {
    adventureId: string;
};

export type GetChatMessagesControllerResponse = ChatMessagesControllerResponse;
