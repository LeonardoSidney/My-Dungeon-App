import { useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { TextInputKeyPressEvent } from 'react-native';
import { Adventure } from '@domain/entities';
import { IAlertController, IDeleteChatAdventureController } from '@domain/controllers';
import { onKeyPressInput } from '../onKeyPressInput';

interface UseMessageActionsParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    deleteChatAdventure: IDeleteChatAdventureController;
    setMessage: Dispatch<SetStateAction<string>>;
    message: string;
    handleSendMessage: () => Promise<void>;
    alert: IAlertController;
}

export function useMessageActions ({
    currentAdventure,
    setCurrentAdventure,
    deleteChatAdventure,
    setMessage,
    message,
    handleSendMessage,
    alert
}: UseMessageActionsParams) {
    const onDeleteMessage = useCallback(
        async (chatId: string, index: number) => {
            const targetChat = currentAdventure.chat.find(c => c.id === chatId);
            if (!targetChat) return;

            const isOnlyVersion = targetChat.index === 0 && targetChat.content.length === 1;

            const response = await deleteChatAdventure.handle({
                adventure: currentAdventure,
                chatId,
                index,
            });

            if (!response.success || !response.adventure) {
                alert.handle({ title: 'Erro', message: response.error ?? 'Failed to delete message' });
                return;
            }

            if (isOnlyVersion) {
                setMessage(targetChat.content[0] ?? '');
            }

            setCurrentAdventure(response.adventure);
        },
        [currentAdventure, setCurrentAdventure, deleteChatAdventure, setMessage, alert]
    );

    const handleKeyPress = useCallback((e: TextInputKeyPressEvent) => {
        onKeyPressInput(e, { message, setMessage, handleSendMessage });
    }, [message, setMessage, handleSendMessage]);

    return {
        onDeleteMessage,
        handleKeyPress
    };
}
