import { useMemo } from 'react';
import { ChatMessageView, ChatThinkView } from '@domain/controllers';
import type { AppControllers } from '@presentation/providers/appControllers';
import { showError } from '@presentation/utils/showError';
import { handleReplyAction, navigateVersion } from '../chatActions';
import type { ChatMessageActions, StreamReply, VersionDirection } from '../types';

type MessageControllers = Pick<
    AppControllers,
    | 'addChatVersion'
    | 'addThinkVersion'
    | 'continueFromChat'
    | 'deleteChatAdventure'
    | 'deleteChatVersion'
    | 'deleteThinkVersion'
    | 'regenerateFromChat'
    | 'selectChatVersion'
    | 'alert'
>;

type UseMessageActionsParams = {
    adventureId: string;
    reloadMessages: () => Promise<void>;
    streamReply: StreamReply;
    setEditingChatId: (chatId: string | null) => void;
    setEditingThinkChatId: (chatId: string | null) => void;
    /** Puts text back into the input, used when a deleted message is offered for rewriting. */
    setComposerMessage: (message: string) => void;
    controllers: MessageControllers;
};

/**
 * Builds the actions of every chat message. The object is memoized and does
 * not depend on the message list, so a streaming update does not re-render
 * the messages that did not change.
 */
export function useMessageActions ({
    adventureId,
    reloadMessages,
    streamReply,
    setEditingChatId,
    setEditingThinkChatId,
    setComposerMessage,
    controllers,
}: UseMessageActionsParams): ChatMessageActions {
    const {
        addChatVersion,
        addThinkVersion,
        continueFromChat,
        deleteChatAdventure,
        deleteChatVersion,
        deleteThinkVersion,
        regenerateFromChat,
        selectChatVersion,
        alert,
    } = controllers;

    return useMemo<ChatMessageActions>(() => {
        const regenerate = (chatId: string, fallbackError: string, scope?: 'content') => handleReplyAction({
            prepare: () => regenerateFromChat.handle({ adventureId, chatId, scope }),
            fallbackError,
            streamReply,
            alert,
        });

        const navigate = (kind: 'content' | 'think') => (chatId: string, direction: VersionDirection) => navigateVersion({
            adventureId,
            chatId,
            kind,
            direction,
            reloadMessages,
            selectChatVersion,
        });

        return {
            deleteMessage: async (message: ChatMessageView) => {
                // Deleting the only version removes the message and hands its text back to the input.
                const hasOtherVersions = message.contentCount > 1;
                const response = hasOtherVersions
                    ? await deleteChatVersion.handle({ adventureId, chatId: message.id, versionIndex: message.contentIndex })
                    : await deleteChatAdventure.handle({ adventureId, chatId: message.id });

                if (!response.success) {
                    showError(alert, response.error, 'Failed to delete message');
                    return;
                }
                if (!hasOtherVersions) {
                    setComposerMessage(message.content);
                }
                await reloadMessages();
            },

            startEdit: (chatId: string) => setEditingChatId(chatId),
            discardEdit: () => setEditingChatId(null),
            saveEdit: async (chatId: string, content: string) => {
                if (!content.trim()) return;
                const response = await addChatVersion.handle({ adventureId, chatId, content });
                if (!response.success) {
                    showError(alert, response.error, 'Failed to save message edit');
                    return;
                }
                setEditingChatId(null);
                setComposerMessage('');
                await reloadMessages();
            },

            continueFrom: async (chatId: string) => {
                const response = await continueFromChat.handle({ adventureId, chatId });
                if (!response.success) {
                    showError(alert, response.error, 'Failed to continue from message');
                    return;
                }
                await streamReply(chatId);
            },
            regenerateFrom: (chatId: string) => regenerate(chatId, 'Failed to regenerate from message'),
            regenerateContent: (chatId: string) => regenerate(chatId, 'Failed to regenerate message content', 'content'),
            regenerateFromThink: (chatId: string) => regenerate(chatId, 'Failed to regenerate from think'),

            navigateContent: navigate('content'),
            navigateThink: navigate('think'),

            startThinkEdit: (chatId: string) => setEditingThinkChatId(chatId),
            discardThinkEdit: () => setEditingThinkChatId(null),
            saveThinkEdit: async (chatId: string, content: string) => {
                if (!content.trim()) return;
                const response = await addThinkVersion.handle({ adventureId, chatId, content });
                if (!response.success) {
                    showError(alert, response.error, 'Failed to save think edit');
                    return;
                }
                setEditingThinkChatId(null);
                await reloadMessages();
            },
            deleteThink: async (chatId: string, think: ChatThinkView) => {
                const response = await deleteThinkVersion.handle({ adventureId, chatId, versionIndex: think.index });
                if (!response.success) {
                    showError(alert, response.error, 'Failed to delete think');
                    return;
                }
                await reloadMessages();
            },
        };
    }, [
        adventureId,
        reloadMessages,
        streamReply,
        setEditingChatId,
        setEditingThinkChatId,
        setComposerMessage,
        addChatVersion,
        addThinkVersion,
        continueFromChat,
        deleteChatAdventure,
        deleteChatVersion,
        deleteThinkVersion,
        regenerateFromChat,
        selectChatVersion,
        alert,
    ]);
}
