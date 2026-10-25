import { useCallback, useEffect, useState } from 'react';
import { createLatestRequestGuard } from '@presentation/shared/createLatestRequestGuard';
import { handleChatReplyUpdate } from '../handleChatReplyUpdate';
import { upsertChatMessage } from '../upsertChatMessage';
import { UseChatReplyUpdatesParams } from './constants';

export function useChatReplyUpdates ({
    adventureId,
    subscribeChatReply,
    getChatMessage,
    getChatMessages,
    setMessages,
    updateMessages,
    alert,
}: UseChatReplyUpdatesParams) {
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
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to listen for chat replies' });
            return;
        }

        setIsReplying(Boolean(response.isReplying));
        return response.unsubscribe;
    }, [adventureId, subscribeChatReply, reloadMessage, reloadMessages, alert]);

    return { isReplying, reloadMessages };
}
