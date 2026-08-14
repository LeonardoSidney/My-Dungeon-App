import { useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { TextInputKeyPressEvent } from 'react-native';
import { Adventure } from '@domain/entities';
import { handleDeleteMessage } from '../handleDeleteMessage';
import { onKeyPressInput } from '../onKeyPressInput';

interface UseMessageActionsParams {
    currentAdventure: Adventure;
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setMessage: Dispatch<SetStateAction<string>>;
    message: string;
    handleSendMessage: () => Promise<void>;
}

export function useMessageActions ({
    currentAdventure,
    setCurrentAdventure,
    setMessage,
    message,
    handleSendMessage
}: UseMessageActionsParams) {
    const onDeleteMessage = useCallback(
        (chatId: string) => {
            const deleteMessage = handleDeleteMessage({
                currentAdventure,
                setCurrentAdventure,
                setMessage,
            });
            deleteMessage(chatId);
        },
        [currentAdventure, setCurrentAdventure, setMessage]
    );

    const handleKeyPress = useCallback((e: TextInputKeyPressEvent) => {
        onKeyPressInput(e, { message, setMessage, handleSendMessage });
    }, [message, setMessage, handleSendMessage]);

    return {
        onDeleteMessage,
        handleKeyPress
    };
}
