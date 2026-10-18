import { Adventure, Chat, RoleEnum, Think } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import {
    IRegenerateFromChatService,
    RegenerateFromChatServiceParams,
    RegenerateFromChatServiceReturn,
} from '@domain/services';

export class RegenerateFromChatService implements IRegenerateFromChatService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }

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

        const targetChat = params.adventure.chat[chatIndex];

        if ((params.scope ?? 'full') === 'content') {
            return this.regenerateChatContentPreservingThink(params, targetChat, chatIndex);
        }

        if (targetChat.role === RoleEnum.USER) {
            return this.regenerateAssistantAfterUserMessage(params, targetChat, chatIndex);
        }

        if (targetChat.role === RoleEnum.ASSISTANT) {
            return this.regenerateAssistantWithFreshThink(params, targetChat, chatIndex);
        }

        return {
            success: false,
            error: `Chat with id ${params.chatId} cannot be regenerated from role ${targetChat.role}`,
        };
    }

    private regenerateAssistantAfterUserMessage (params: RegenerateFromChatServiceParams, targetChat: Chat, chatIndex: number): RegenerateFromChatServiceReturn {
        const chats = params.adventure.chat;
        const assistantIndex = chats.findIndex((c, i) => i > chatIndex && c.role === RoleEnum.ASSISTANT);

        if (assistantIndex === -1) {
            const updatedAdventure: Adventure = {
                ...params.adventure,
                chat: chats.slice(0, chatIndex + 1),
                updatedAt: new Date(),
            };

            this.logger.debug('RegenerateFromChatService::regenerateAssistantAfterUserMessage - no assistant chat to preserve, history truncated after user message', {
                chatId: targetChat.id,
                remainingChats: updatedAdventure.chat.length,
            });

            return {
                success: true,
                adventure: updatedAdventure,
            };
        }

        const assistantChat = chats[assistantIndex];
        const thinkSlot = this.resolveAnswerThinkSlot(assistantChat.think);
        const preservedChat: Chat = {
            ...assistantChat,
            content: [...assistantChat.content, ''],
            index: assistantChat.content.length,
            think: thinkSlot.think,
            thinkIndex: thinkSlot.thinkIndex,
            isStreaming: false,
            updatedAt: new Date(),
        };

        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: [...chats.slice(0, assistantIndex), preservedChat],
            updatedAt: preservedChat.updatedAt,
        };

        this.logger.debug('RegenerateFromChatService::regenerateAssistantAfterUserMessage - think slot resolved for the regenerated answer', {
            chatId: preservedChat.id,
            thinkIndex: preservedChat.thinkIndex,
            remainingChats: updatedAdventure.chat.length,
        });

        return {
            success: true,
            chat: preservedChat,
            adventure: updatedAdventure,
        };
    }

    private regenerateAssistantWithFreshThink (params: RegenerateFromChatServiceParams, targetChat: Chat, chatIndex: number): RegenerateFromChatServiceReturn {
        const chats = params.adventure.chat;
        const thinkSlot = this.resolveAnswerThinkSlot(targetChat.think);

        const freshChat: Chat = {
            ...targetChat,
            content: [...targetChat.content, ''],
            index: targetChat.content.length,
            think: thinkSlot.think,
            thinkIndex: thinkSlot.thinkIndex,
            isStreaming: false,
            updatedAt: new Date(),
        };

        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: [...chats.slice(0, chatIndex), freshChat],
            updatedAt: freshChat.updatedAt,
        };

        this.logger.debug('RegenerateFromChatService::regenerateAssistantWithFreshThink - content slot appended and think slot resolved', {
            chatId: freshChat.id,
            thinkIndex: freshChat.thinkIndex,
            remainingChats: updatedAdventure.chat.length,
        });

        return {
            success: true,
            chat: freshChat,
            adventure: updatedAdventure,
        };
    }

    private resolveAnswerThinkSlot (think?: Think[]): { think: Think[]; thinkIndex: number; } {
        const existing = think ?? [];

        for (let i = existing.length - 1; i >= 0; i -= 1) {
            if (!existing[i].content) {
                return { think: existing, thinkIndex: i };
            }
        }

        const appended = [...existing, { id: this.idGenerator.generate(), content: undefined, enabled: false }];
        return { think: appended, thinkIndex: appended.length - 1 };
    }

    private regenerateChatContentPreservingThink (params: RegenerateFromChatServiceParams, targetChat: Chat, chatIndex: number): RegenerateFromChatServiceReturn {
        if (targetChat.role !== RoleEnum.ASSISTANT) {
            return {
                success: false,
                error: `Chat with id ${targetChat.id} cannot have its content regenerated from role ${targetChat.role}`,
            };
        }

        const chats = params.adventure.chat;

        const freshChat: Chat = {
            ...targetChat,
            content: [...targetChat.content, ''],
            index: targetChat.content.length,
            isStreaming: false,
            updatedAt: new Date(),
        };

        const updatedAdventure: Adventure = {
            ...params.adventure,
            chat: [...chats.slice(0, chatIndex), freshChat],
            updatedAt: freshChat.updatedAt,
        };

        this.logger.debug('RegenerateFromChatService::regenerateChatContentPreservingThink - content slot appended, selected think preserved', {
            chatId: freshChat.id,
            thinkIndex: freshChat.thinkIndex,
        });

        return {
            success: true,
            chat: freshChat,
            adventure: updatedAdventure,
        };
    }
}
