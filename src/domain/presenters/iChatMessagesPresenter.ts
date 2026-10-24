import type { Chat } from '../entities';
import type { ChatMessageView } from '../controllers';

export interface IChatMessagesPresenter {
    present (chats: Chat[]): ChatMessageView[];
    presentOne (chat: Chat): ChatMessageView;
}
