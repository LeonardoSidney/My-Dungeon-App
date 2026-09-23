import { Adventure, RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IRegenerateFromChatService,
    RegenerateFromChatServiceParams,
    RegenerateFromChatServiceReturn,
} from '@domain/services';

export class RegenerateFromChatService implements IRegenerateFromChatService {
    constructor (private readonly logger: ILogger) { }

    regenerateFromChat (params: RegenerateFromChatServiceParams): RegenerateFromChatServiceReturn {
        this.logger.info('Executing RegenerateFromChatService::regenerateFromChat');
        this.logger.debug('Executing RegenerateFromChatService::regenerateFromChat - params', {
            chatId: params.chatId,
        });

        const chatIndex = params.adventure.chat.findIndex(c => c.id === params.chatId);
        if (chatIndex === -1) {
            return {
                success: false,
                error: `Chat with id ${params.chatId} was not found`,
            };
        }

        const chatsBeforeTarget = params.adventure.chat.slice(0, chatIndex + 1);
        const lastUserMessageIndex = chatsBeforeTarget.reduce((last, chat, i) => (chat.role === RoleEnum.USER ? i : last), -1);

        if (lastUserMessageIndex === -1) {
            return {
                success: false,
                error: `No user message found before chat ${params.chatId}`,
            };
        }

        const chats = params.adventure.chat.slice(0, lastUserMessageIndex + 1);

        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: chats,
            updatedAt: new Date(),
        };

        this.logger.debug('RegenerateFromChatService::regenerateFromChat - history truncated after last user message', {
            chatId: params.chatId,
            remainingChats: chats.length,
        });

        return {
            success: true,
            adventure: updatedAdventure,
        };
    }
}
