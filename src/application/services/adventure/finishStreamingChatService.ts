import { ILogger } from '@domain/logger';
import {
    FinishStreamingChatServiceParams,
    FinishStreamingChatServiceReturn,
    IFinishStreamingChatService,
} from '@domain/services';

export class FinishStreamingChatService implements IFinishStreamingChatService {
    constructor (private readonly logger: ILogger) {}

    finishStreamingChat (params: FinishStreamingChatServiceParams): FinishStreamingChatServiceReturn {
        this.logger.info('Executing FinishStreamingChatService::finishStreamingChat');
        this.logger.debug('FinishStreamingChatService::finishStreamingChat - params', params);

        const { adventure, chatId } = params;

        const chatIndex = adventure.chat.findIndex(c => c.id === chatId);
        if (chatIndex === -1) {
            this.logger.warning('FinishStreamingChatService::finishStreamingChat - chat not found');
            return {
                success: false,
                error: 'Chat not found in adventure',
            };
        }

        const chat = adventure.chat[chatIndex];
        const updatedChat = {
            ...chat,
            isStreaming: false,
            updatedAt: new Date(),
        };

        const updatedAdventure = {
            ...adventure,
            chat: adventure.chat.map((c, i) => i === chatIndex ? updatedChat : c),
            updatedAt: updatedChat.updatedAt,
        };

        this.logger.debug('FinishStreamingChatService::finishStreamingChat - chat finished', updatedChat);

        return {
            success: true,
            chat: updatedChat,
            adventure: updatedAdventure,
        };
    }
}
