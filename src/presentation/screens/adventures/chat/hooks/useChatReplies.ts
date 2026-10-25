import { useCallback, useEffect, useState } from 'react';
import {
    IAlertController,
    IGenerateChatReplyController,
    IGetChatMessageController,
    IGetChatMessagesController,
    IStopChatReplyController,
    ISubscribeChatReplyController,
} from '@domain/controllers';
import { createLatestRequestGuard } from '@presentation/utils/createLatestRequestGuard';
import { showError } from '@presentation/utils/showError';
import { handleChatReplyUpdate, requestChatReply, upsertChatMessage } from '../chatActions';
import type { SetMessages, UpdateMessages } from '../types';

type UseChatRepliesParams = {
    adventureId: string;
    subscribeChatReply: ISubscribeChatReplyController;
    getChatMessage: IGetChatMessageController;
    getChatMessages: IGetChatMessagesController;
    generateChatReply: IGenerateChatReplyController;
    stopChatReply: IStopChatReplyController;
    setMessages: SetMessages;
    updateMessages: UpdateMessages;
    alert: IAlertController;
};

/**
 * Owns the conversation with the backend: listens to the reply stream,
 * refreshes the messages it touches, and starts or stops a reply.
 */
export function useChatReplies ({
    adventureId,
    subscribeChatReply,
    getChatMessage,
    getChatMessages,
    generateChatReply,
    stopChatReply,
    setMessages,
    updateMessages,
    alert,
}: UseChatRepliesParams) {
    const [isReplying, setIsReplying] = useState(false);
    const [guard] = useState(createLatestRequestGuard);

    const reloadMessages = useCallback(async (): Promise<void> => {
        const request = guard.next();
        const response = await getChatMessages.handle({ adventureId });
        if (response.success && response.messages && guard.claim(request)) {
            setMessages(response.messages);
        }
    }, [adventureId, getChatMessages, setMessages, guard]);

    const reloadMessage = useCallback(async (chatId: string): Promise<void> => {
        const request = guard.next();
        const response = await getChatMessage.handle({ adventureId, chatId });
        if (!response.success || !response.message) {
            await reloadMessages();
            return;
        }

        const message = response.message;
        if (guard.claim(request)) {
            updateMessages(messages => upsertChatMessage(messages, message));
        }
    }, [adventureId, getChatMessage, updateMessages, reloadMessages, guard]);

    useEffect(() => {
        const response = subscribeChatReply.handle({
            adventureId,
            onUpdate: update => {
                handleChatReplyUpdate({ update, reloadMessage, reloadMessages, setIsReplying, alert });
            },
        });

        if (!response.success || !response.unsubscribe) {
            showError(alert, response.error, 'Failed to listen for chat replies');
            return;
        }

        setIsReplying(Boolean(response.isReplying));
        return response.unsubscribe;
    }, [adventureId, subscribeChatReply, reloadMessage, reloadMessages, alert]);

    const streamReply = useCallback(
        (replyChatId?: string) => requestChatReply({ adventureId, replyChatId, generateChatReply, reloadMessages, alert }),
        [adventureId, generateChatReply, reloadMessages, alert],
    );

    const stopReply = useCallback(() => {
        const response = stopChatReply.handle({ adventureId });
        if (!response.success) {
            showError(alert, response.error, 'Failed to stop the assistant reply');
        }
    }, [adventureId, stopChatReply, alert]);

    return { isReplying, reloadMessages, streamReply, stopReply };
}
