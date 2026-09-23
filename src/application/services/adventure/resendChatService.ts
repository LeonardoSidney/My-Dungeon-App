import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IResendChatService,
    ResendChatServiceParams,
    ResendChatServiceReturn,
} from '@domain/services';

export class ResendChatService implements IResendChatService {
    constructor (private readonly logger: ILogger) { }

    resendChat (params: ResendChatServiceParams): ResendChatServiceReturn {
        this.logger.info('Executing ResendChatService::resendChat');
        this.logger.debug('Executing ResendChatService::resendChat - params', {
            chatId: params.chatId,
        });

        const chatIndex = params.adventure.chat.findIndex(c => c.id === params.chatId);
        if (chatIndex === -1) {
            return {
                success: false,
                error: `Chat with id ${params.chatId} was not found`,
            };
        }

        const chats = params.adventure.chat.filter(c => c.id !== params.chatId);

        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: chats,
            updatedAt: new Date(),
        };

        this.logger.debug('ResendChatService::resendChat - target chat removed', {
            chatId: params.chatId,
            remainingChats: chats.length,
        });

        return {
            success: true,
            adventure: updatedAdventure,
        };
    }
}
