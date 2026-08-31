import { Chat } from '@domain/entities';
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
}
