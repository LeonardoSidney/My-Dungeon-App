import { useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { TextInputKeyPressEvent } from 'react-native';
import { ChatMessageView, IAlertController, IDeleteChatAdventureController, IDeleteChatVersionController } from '@domain/controllers';
import { onKeyPressInput } from '../onKeyPressInput';

interface UseMessageActionsParams {
    adventureId: string;
    messages: ChatMessageView[];
    reloadMessages: () => Promise<void>;
    deleteChatAdventure: IDeleteChatAdventureController;
    deleteChatVersion: IDeleteChatVersionController;
    setMessage: Dispatch<SetStateAction<string>>;
    message: string;
    handleSendMessage: () => Promise<void>;
    alert: IAlertController;
}

export function useMessageActions ({
    adventureId,
    messages,
    reloadMessages,
    deleteChatAdventure,
    deleteChatVersion,
    setMessage,
    message,
    handleSendMessage,
    alert
}: UseMessageActionsParams) {
    const onDeleteMessage = useCallback(
        async (chatId: string) => {
            const target = messages.find(entry => entry.id === chatId);
            if (!target) return;

            const hasOtherVersions = target.contentCount > 1;
            const response = hasOtherVersions
                ? await deleteChatVersion.handle({ adventureId, chatId, versionIndex: target.contentIndex })
                : await deleteChatAdventure.handle({ adventureId, chatId });

            if (!response.success) {
                alert.handle({ title: 'Erro', message: response.error ?? 'Failed to delete message' });
                return;
            }

            if (!hasOtherVersions) {
                setMessage(target.content);
            }

            await reloadMessages();
        },
        [adventureId, messages, reloadMessages, deleteChatAdventure, deleteChatVersion, setMessage, alert]
    );

    const handleKeyPress = useCallback((e: TextInputKeyPressEvent) => {
        onKeyPressInput(e, { message, setMessage, handleSendMessage });
    }, [message, setMessage, handleSendMessage]);

    return {
        onDeleteMessage,
        handleKeyPress
    };
}
