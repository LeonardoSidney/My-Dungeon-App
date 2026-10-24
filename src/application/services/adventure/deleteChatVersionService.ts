import { Adventure, Chat } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    DeleteChatVersionServiceParams,
    DeleteChatVersionServiceReturn,
    IDeleteChatVersionService,
} from '@domain/services';

export class DeleteChatVersionService implements IDeleteChatVersionService {
    constructor (private readonly logger: ILogger) { }

    deleteVersion (params: DeleteChatVersionServiceParams): DeleteChatVersionServiceReturn {
        this.logger.info('Executing DeleteChatVersionService::deleteVersion');
        this.logger.debug('Executing DeleteChatVersionService::deleteVersion - params', {
            chatId: params.chatId,
            versionIndex: params.versionIndex,
        });

        const chatIndex = params.adventure.chat.findIndex(c => c.id === params.chatId);
        if (chatIndex === -1) {
            return { success: false, error: `Chat with id ${params.chatId} was not found` };
        }

        const existingChat = params.adventure.chat[chatIndex];
        if (params.versionIndex < 0 || params.versionIndex >= existingChat.content.length) {
            return { success: false, error: `Version index ${params.versionIndex} is out of bounds` };
        }

        if (existingChat.content.length === 1) {
            return { success: false, error: 'The only version of a chat cannot be deleted, delete the chat instead' };
        }

        const content = existingChat.content.filter((_, i) => i !== params.versionIndex);
        const chat: Chat = {
            ...existingChat,
            content,
            index: Math.min(Math.max(params.versionIndex - 1, 0), content.length - 1),
            updatedAt: new Date(),
        };
        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: params.adventure.chat.map((c, i) => (i === chatIndex ? chat : c)),
            updatedAt: new Date(),
        };

        this.logger.debug('DeleteChatVersionService::deleteVersion - version deleted, previous version revealed', { chatId: params.chatId, index: chat.index });

        return { success: true, adventure: updatedAdventure };
    }
}
