import type { IKeyedEventChannel, KeyedEventListener } from './iKeyedEventChannel';

export enum ChatReplyStatusEnum {
    STREAMING = 'streaming',
    FINISHED = 'finished',
    REMOVED = 'removed'
}

export type ChatReplyStatus = ChatReplyStatusEnum.STREAMING | ChatReplyStatusEnum.FINISHED | ChatReplyStatusEnum.REMOVED;

export type ChatReplyEvent = {
    adventureId: string;
    chatId: string;
    status: ChatReplyStatus;
    error?: string;
};

export type ChatReplyListener = KeyedEventListener<ChatReplyEvent>;

export type IChatReplyChannel = IKeyedEventChannel<ChatReplyEvent>;
