import { Chat, Think } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import {
    IEditThinkAdventureService,
    EditThinkAdventureServiceParams,
    EditThinkAdventureServiceReturn,
} from '@domain/services';

export class EditThinkAdventureService implements IEditThinkAdventureService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }

    editThink (params: EditThinkAdventureServiceParams): EditThinkAdventureServiceReturn {
        this.logger.info('Executing EditThinkAdventureService::editThink');
        this.logger.debug('Executing EditThinkAdventureService::editThink - params', {
            chatId: params.chatId,
        });

        const chatIndex = params.adventure.chat.findIndex(c => c.id === params.chatId);
        if (chatIndex === -1) {
            return {
                success: false,
                error: `Chat with id ${params.chatId} was not found`,
            };
        }

        const existingChat = params.adventure.chat[chatIndex];
        const existingThink = existingChat.think ?? [];
        const now = new Date();
        const think: Think[] = [
            ...existingThink,
            {
                id: this.idGenerator.generate(),
                content: params.content,
                enabled: true,
            },
        ];

        const chat: Chat = {
            ...existingChat,
            think,
            thinkIndex: think.length - 1,
            isStreaming: false,
            updatedAt: now,
        };

        const chatsBefore = params.adventure.chat.slice(0, chatIndex);
        const chatsAfter = params.adventure.chat.slice(chatIndex + 1);
        const updatedChat = [...chatsBefore, chat, ...chatsAfter];

        const updatedAdventure = {
            ...params.adventure,
            chat: updatedChat,
            updatedAt: now,
        };

        this.logger.debug('EditThinkAdventureService::editThink - think version appended', chat);

        return {
            success: true,
            chat,
            adventure: updatedAdventure,
        };
    }
}
