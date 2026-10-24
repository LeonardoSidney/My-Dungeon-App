import type { ChatMessageView } from './iChatMessageView';

export type ChatMessagesControllerResponse = {
    success: boolean;
    messages?: ChatMessageView[];
    error?: string;
};
