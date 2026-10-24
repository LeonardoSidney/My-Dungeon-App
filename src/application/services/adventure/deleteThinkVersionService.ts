import { Adventure, Chat } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IDeleteThinkVersionService,
    DeleteThinkVersionServiceParams,
    DeleteThinkVersionServiceReturn,
} from '@domain/services';

export class DeleteThinkVersionService implements IDeleteThinkVersionService {
    constructor (private readonly logger: ILogger) { }

    deleteThink (params: DeleteThinkVersionServiceParams): DeleteThinkVersionServiceReturn {
        this.logger.info('Executing DeleteThinkVersionService::deleteThink');
        this.logger.debug('Executing DeleteThinkVersionService::deleteThink - params', {
            chatId: params.chatId,
            versionIndex: params.versionIndex,
        });

        const chatIndex = params.adventure.chat.findIndex(c => c.id === params.chatId);
        if (chatIndex === -1) {
            return {
                success: false,
                error: `Chat with id ${params.chatId} was not found`,
            };
        }

        const existingChat = params.adventure.chat[chatIndex];
        const existingThink = existingChat.think;

        if (!existingThink) {
            return {
                success: false,
                error: `Chat with id ${params.chatId} has no think versions to delete`,
            };
        }

        if (params.versionIndex < 0 || params.versionIndex >= existingThink.length) {
            return {
                success: false,
                error: `Think version index ${params.versionIndex} is out of bounds`,
            };
        }

        const index = params.versionIndex;
        const updatedThink = existingThink.filter((_, i) => i !== index);

        if (updatedThink.length === 0) {
            this.logger.debug('DeleteThinkVersionService::deleteThink - only think version cannot be deleted', { chatId: params.chatId });

            return {
                success: false,
                error: `${params.chatId} has only one think version left, refusing to delete it`,
            };
        }

        const now = new Date();

        const nextIndex = Math.min(Math.max(index - 1, 0), updatedThink.length - 1);
        const chat: Chat = {
            ...existingChat,
            think: updatedThink,
            thinkIndex: nextIndex,
            isStreaming: false,
            updatedAt: now,
        };

        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: params.adventure.chat.map((c, i) => (i === chatIndex ? chat : c)),
            updatedAt: now,
        };

        this.logger.debug('DeleteThinkVersionService::deleteThink - version deleted, previous version revealed', { chatId: params.chatId, index: nextIndex });

        return {
            success: true,
            adventure: updatedAdventure,
        };
    }
}
