import { Chat } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IAddChatVersionService,
    AddChatVersionServiceParams,
    AddChatVersionServiceReturn,
} from '@domain/services';

export class AddChatVersionService implements IAddChatVersionService {
    constructor (private readonly logger: ILogger) { }

    addVersion (params: AddChatVersionServiceParams): AddChatVersionServiceReturn {
        this.logger.info('Executing AddChatVersionService::addVersion');
        this.logger.debug('Executing AddChatVersionService::addVersion - params', {
            chatId: params.chatId,
            role: params.role,
            characterId: params.characterId,
        });

        const chatIndex = params.adventure.chat.findIndex(c => c.id === params.chatId);
        if (chatIndex === -1) {
            return {
                success: false,
                error: `Chat with id ${params.chatId} was not found`,
            };
        }

        const existingChat = params.adventure.chat[chatIndex];
        const now = new Date();
        const chat: Chat = {
            ...existingChat,
            content: [...existingChat.content, params.content],
            index: existingChat.content.length,
            isStreaming: false,
            updatedAt: now,
        };

        const chatsBefore = params.adventure.chat.slice(0, chatIndex);
        const chatsAfter = params.adventure.chat.slice(chatIndex + 1);
        const updatedChat = [...chatsBefore, chat, ...chatsAfter];

        const updatedAdventure = {
            ...params.adventure,
            chat: updatedChat,
            updatedAt: now,
        };

        this.logger.debug('AddChatVersionService::addVersion - chat version appended', chat);

        return {
            success: true,
            chat,
            adventure: updatedAdventure,
        };
    }
}
