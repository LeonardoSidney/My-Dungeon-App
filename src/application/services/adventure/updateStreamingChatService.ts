import { ILogger } from '@domain/logger';
import {
    UpdateStreamingChatServiceParams,
    UpdateStreamingChatServiceReturn,
    IUpdateStreamingChatService,
} from '@domain/services';

export class UpdateStreamingChatService implements IUpdateStreamingChatService {
    constructor (private readonly logger: ILogger) { }

    updateStreamingChat (params: UpdateStreamingChatServiceParams): UpdateStreamingChatServiceReturn {
        this.logger.info('Executing UpdateStreamingChatService::updateStreamingChat');
        this.logger.debug('UpdateStreamingChatService::updateStreamingChat - params', params);

        const { adventure, chatId, content, think } = params;

        const chatIndex = adventure.chat.findIndex(c => c.id === chatId);
        if (chatIndex === -1) {
            this.logger.warning('UpdateStreamingChatService::updateStreamingChat - chat not found');
            return {
                success: false,
                error: 'Chat not found in adventure',
            };
        }

        const chat = adventure.chat[chatIndex];
        const updatedChat = {
            ...chat,
            content: chat.content.map((c, i) => i === chat.index ? content : c),
        };

        if (think !== undefined) {
            updatedChat.think = [think];
        }

        updatedChat.updatedAt = new Date();
        const updatedAdventure = {
            ...adventure,
            chat: adventure.chat.map((c, i) => i === chatIndex ? updatedChat : c),
            updatedAt: updatedChat.updatedAt,
        };

        this.logger.debug('UpdateStreamingChatService::updateStreamingChat - chat updated', updatedChat);

        return {
            success: true,
            chat: updatedChat,
            adventure: updatedAdventure,
        };
    }
}
