import { Chat, Think } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    UpdateStreamingChatServiceParams,
    UpdateStreamingChatServiceReturn,
    IUpdateStreamingChatService,
} from '@domain/services';

export class UpdateStreamingChatService implements IUpdateStreamingChatService {
    constructor (private readonly logger: ILogger) { }

    updateStreamingChat (params: UpdateStreamingChatServiceParams): UpdateStreamingChatServiceReturn {
        this.logger.streaming('Executing UpdateStreamingChatService::updateStreamingChat');
        this.logger.storage('UpdateStreamingChatService::updateStreamingChat - params', params);

        const { adventure, chatId, content, think } = params;

        const chatIndex = adventure.chat.findIndex(c => c.id === chatId);
        if (chatIndex === -1) {
            this.logger.warning('UpdateStreamingChatService::updateStreamingChat - chat not found');
            return {
                success: false,
                error: 'Chat not found in adventure',
            };
        }

        const chat = adventure.chat[chatIndex];
        const updatedChat = {
            ...chat,
            content: chat.content.map((c, i) => i === chat.index ? content : c),
        };

        if (think !== undefined) {
            const thinkUpdate = this.applyThinkUpdate(chat, think);
            updatedChat.think = thinkUpdate.think;
            updatedChat.thinkIndex = thinkUpdate.thinkIndex;
        }

        updatedChat.updatedAt = new Date();
        const updatedAdventure = {
            ...adventure,
            chat: adventure.chat.map((c, i) => i === chatIndex ? updatedChat : c),
            updatedAt: updatedChat.updatedAt,
        };

        this.logger.streaming('UpdateStreamingChatService::updateStreamingChat - chat updated', updatedChat);

        return {
            success: true,
            chat: updatedChat,
            adventure: updatedAdventure,
        };
    }

    private applyThinkUpdate (chat: Chat, incomingThink: Think): { think: Think[]; thinkIndex: number; } {
        const existingThink = chat.think ?? [];
        const versionIndex = existingThink.findIndex(t => t.id === incomingThink.id);

        if (versionIndex !== -1) {
            const updatedThink = existingThink.map((t, i) => (i === versionIndex ? incomingThink : t));
            return { think: updatedThink, thinkIndex: versionIndex };
        }

        const appendedThink = [...existingThink, incomingThink];
        return { think: appendedThink, thinkIndex: appendedThink.length - 1 };
    }
}
