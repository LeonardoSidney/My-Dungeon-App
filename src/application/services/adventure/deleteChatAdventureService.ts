import { Adventure, Chat, RoleEnum } from '@domain/entities';
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

        const removedChatIds = this.resolveRemovedChatIds(params.adventure, chatIndex, params.adventure.chat[chatIndex]);
        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: params.adventure.chat.filter(c => !removedChatIds.includes(c.id)),
            updatedAt: new Date(),
        };

        this.logger.debug('DeleteChatAdventureService::deleteChat - chat removed', { chatId: params.chatId, removedChatIds });

        return {
            success: true,
            adventure: updatedAdventure,
        };
    }

    private resolveRemovedChatIds (adventure: Adventure, chatIndex: number, existingChat: Chat): string[] {
        if (existingChat.role !== RoleEnum.USER) {
            return [existingChat.id];
        }

        const nextChat = adventure.chat[chatIndex + 1];
        if (nextChat?.role !== RoleEnum.ASSISTANT) {
            return [existingChat.id];
        }

        return [existingChat.id, nextChat.id];
    }
}
