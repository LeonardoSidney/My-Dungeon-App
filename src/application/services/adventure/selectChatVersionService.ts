import { Adventure, Chat } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ChatVersionKind,
    ISelectChatVersionService,
    SelectChatVersionServiceParams,
    SelectChatVersionServiceReturn,
} from '@domain/services';

export class SelectChatVersionService implements ISelectChatVersionService {
    constructor (private readonly logger: ILogger) { }

    selectVersion (params: SelectChatVersionServiceParams): SelectChatVersionServiceReturn {
        this.logger.info('Executing SelectChatVersionService::selectVersion');

        const chatIndex = params.adventure.chat.findIndex(chat => chat.id === params.chatId);
        if (chatIndex === -1) {
            return { success: false, error: `Chat with id ${params.chatId} was not found` };
        }

        const currentChat = params.adventure.chat[chatIndex];
        const versionCount = this.getVersionCount(currentChat, params.kind);
        if (params.index < 0 || params.index >= versionCount) {
            return { success: false, error: `Version index ${params.index} is out of bounds` };
        }

        const updatedChat: Chat = {
            ...currentChat,
            index: params.kind === 'content' ? params.index : currentChat.index,
            thinkIndex: params.kind === 'think' ? params.index : currentChat.thinkIndex,
            updatedAt: new Date(),
        };
        const adventure: Adventure = {
            ...params.adventure,
            chat: params.adventure.chat.map((chat, index) => index === chatIndex ? updatedChat : chat),
            updatedAt: new Date(),
        };

        return { success: true, chat: updatedChat, adventure };
    }

    private getVersionCount (chat: Chat, kind: ChatVersionKind): number {
        if (kind === 'content') {
            return chat.content.length;
        }

        return chat.think?.length ?? 0;
    }
}
