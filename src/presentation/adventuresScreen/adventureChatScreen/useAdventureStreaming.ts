import { useCallback } from 'react';
import { useChatReplyUpdates } from './hooks/useChatReplyUpdates';
import { useResend } from './hooks/useResend';
import { useSendMessage } from './hooks/useSendMessage';
import { requestChatReply } from './requestChatReply';
import { handleReplyAction } from './handleReplyAction';
import { UseAdventureStreamingParams } from './constants';

export function useAdventureStreaming (params: UseAdventureStreamingParams) {
    const { adventureId, selectedCharacter, message, setMessages, updateMessages, setMessage, editingChatIdRef, clearEditing, appendChatAdventure, addChatVersion, continueFromChat, regenerateFromChat, resendChat, generateChatReply, getChatMessages, getChatMessage, stopChatReply, subscribeChatReply, alert } = params;

    const { isReplying, reloadMessages } = useChatReplyUpdates({
        adventureId,
        subscribeChatReply,
        getChatMessage,
        getChatMessages,
        setMessages,
        updateMessages,
        alert,
    });

    const streamReply = useCallback(async (replyChatId?: string) => {
        await requestChatReply({
            adventureId,
            replyChatId,
            generateChatReply,
            reloadMessages,
            alert,
        });
    }, [adventureId, generateChatReply, reloadMessages, alert]);

    const stopStreaming = useCallback(() => {
        const response = stopChatReply.handle({ adventureId });
        if (!response.success) {
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to stop the assistant reply' });
        }
    }, [adventureId, stopChatReply, alert]);

    const { handleResend } = useResend({
        adventureId,
        setMessage,
        streamReply,
        editingChatIdRef,
        message,
        clearEditing,
        addChatVersion,
        resendChat,
        alert
    });

    const { handleSendMessage } = useSendMessage({
        adventureId,
        message,
        selectedCharacter,
        reloadMessages,
        setMessage,
        streamReply,
        appendChatAdventure,
        addChatVersion,
        editingChatIdRef,
        clearEditing,
        alert
    });

    const handleRegenerateFromMessage = useCallback((chatId: string) => handleReplyAction({
        prepare: () => regenerateFromChat.handle({ adventureId, chatId }),
        fallbackError: 'Failed to regenerate from message',
        streamReply,
        alert,
    }), [adventureId, regenerateFromChat, streamReply, alert]);

    const handleRegenerateFromThink = useCallback((chatId: string) => handleReplyAction({
        prepare: () => regenerateFromChat.handle({ adventureId, chatId }),
        fallbackError: 'Failed to regenerate from think',
        streamReply,
        alert,
    }), [adventureId, regenerateFromChat, streamReply, alert]);

    const handleRegenerateContent = useCallback((chatId: string) => handleReplyAction({
        prepare: () => regenerateFromChat.handle({ adventureId, chatId, scope: 'content' }),
        fallbackError: 'Failed to regenerate message content',
        streamReply,
        alert,
    }), [adventureId, regenerateFromChat, streamReply, alert]);

    const handleContinueFromMessage = useCallback(async (chatId: string) => {
        const response = await continueFromChat.handle({ adventureId, chatId });
        if (!response.success) {
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to continue from message' });
            return;
        }

        await streamReply(chatId);
    }, [adventureId, continueFromChat, streamReply, alert]);

    return {
        isStreaming: isReplying,
        handleResend,
        handleSendMessage,
        handleRegenerateFromMessage,
        handleRegenerateFromThink,
        handleRegenerateContent,
        handleContinueFromMessage,
        handleStopStreaming: stopStreaming
    };
}
