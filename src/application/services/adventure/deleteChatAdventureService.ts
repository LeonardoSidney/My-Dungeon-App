import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IDeleteChatAdventureService,
    DeleteChatAdventureServiceParams,
    DeleteChatAdventureServiceReturn,
} from '@domain/services';

export class DeleteChatAdventureService implements IDeleteChatAdventureService {
    constructor (private readonly logger: ILogger) { }

    deleteChat (params: DeleteChatAdventureServiceParams): DeleteChatAdventureServiceReturn {
        this.logger.info('Executing DeleteChatAdventureService::deleteChat');
        this.logger.debug('Executing DeleteChatAdventureService::deleteChat - params', { chatId: params.chatId });

        const chatIndex = params.adventure.chat.findIndex(c => c.id === params.chatId);
        if (chatIndex === -1) {
            return {
                success: false,
                error: `Chat with id ${params.chatId} was not found`,
            };
        }

        const removedChatIds = params.adventure.chat.slice(chatIndex).map(c => c.id);
        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: params.adventure.chat.slice(0, chatIndex),
            updatedAt: new Date(),
        };

        this.logger.debug('DeleteChatAdventureService::deleteChat - chat removed', { chatId: params.chatId, removedChatIds });

        return {
            success: true,
            adventure: updatedAdventure,
        };
    }
}
