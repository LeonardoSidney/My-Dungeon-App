import { Adventure, Chat } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import {
    StartStreamingChatServiceParams,
    StartStreamingChatServiceReturn,
    IStartStreamingChatService,
} from '@domain/services';

export class StartStreamingChatService implements IStartStreamingChatService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }

    startStreamingChat (params: StartStreamingChatServiceParams): StartStreamingChatServiceReturn {
        this.logger.info('Executing StartStreamingChatService::startStreamingChat');
        this.logger.debug('StartStreamingChatService::startStreamingChat - params', params);

        const { adventure, role, characterId } = params;

        if (params.chatId) {
            return this.startExistingChat(adventure, params.chatId);
        }

        const now = new Date();
        const chatId = this.idGenerator.generate();

        const chat: Chat = {
            id: chatId,
            role,
            index: 0,
            content: [''],
            think: undefined,
            characterId,
            isStreaming: true,
            createdAt: now,
            updatedAt: now,
        };

        const updatedAdventure = {
            ...adventure,
            chat: [...adventure.chat, chat],
            updatedAt: now,
        };

        this.logger.debug('StartStreamingChatService::startStreamingChat - chat created', chat);

        return {
            success: true,
            chat,
            adventure: updatedAdventure,
        };
    }

    private startExistingChat (adventure: Adventure, chatId: string): StartStreamingChatServiceReturn {
        const chatIndex = adventure.chat.findIndex(c => c.id === chatId);
        if (chatIndex === -1) {
            this.logger.warning('StartStreamingChatService::startExistingChat - chat not found');
            return {
                success: false,
                error: 'Chat not found in adventure',
            };
        }

        const chat = adventure.chat[chatIndex];
        const updatedChat = {
            ...chat,
            isStreaming: true,
            updatedAt: new Date(),
        };

        const updatedAdventure = {
            ...adventure,
            chat: adventure.chat.map((c, i) => i === chatIndex ? updatedChat : c),
            updatedAt: updatedChat.updatedAt,
        };

        this.logger.debug('StartStreamingChatService::startExistingChat - existing chat streaming', updatedChat);

        return {
            success: true,
            chat: updatedChat,
            adventure: updatedAdventure,
        };
    }
}
