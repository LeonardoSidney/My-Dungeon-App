import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IContinueFromChatService,
    ContinueFromChatServiceParams,
    ContinueFromChatServiceReturn,
} from '@domain/services';

export class ContinueFromChatService implements IContinueFromChatService {
    constructor (private readonly logger: ILogger) { }

    continueFromChat (params: ContinueFromChatServiceParams): ContinueFromChatServiceReturn {
        this.logger.info('Executing ContinueFromChatService::continueFromChat');
        this.logger.debug('Executing ContinueFromChatService::continueFromChat - params', {
            chatId: params.chatId,
        });

        const chatIndex = params.adventure.chat.findIndex(c => c.id === params.chatId);
        if (chatIndex === -1) {
            return {
                success: false,
                error: `Chat with id ${params.chatId} was not found`,
            };
        }

        const chats = params.adventure.chat.slice(0, chatIndex + 1);

        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: chats,
            updatedAt: new Date(),
        };

        this.logger.debug('ContinueFromChatService::continueFromChat - history truncated after target chat', {
            chatId: params.chatId,
            remainingChats: chats.length,
        });

        return {
            success: true,
            adventure: updatedAdventure,
        };
    }
}
