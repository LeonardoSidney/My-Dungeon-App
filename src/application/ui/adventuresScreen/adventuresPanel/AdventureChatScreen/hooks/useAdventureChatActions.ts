import { useCallback } from 'react';
import { TextInputKeyPressEvent } from 'react-native';
import { Adventure, Character } from '@domain/entities';
import { handleCharacterSelect } from '../handleCharacterSelect';
import { handleDeleteMessage } from '../handleDeleteMessage';
import { handleWorldMasterSelect } from '../handleWorldMasterSelect';
import { onHideSettings } from '../onHideSettings';
import { onKeyPressInput } from '../onKeyPressInput';
import { onShowSettings } from '../onShowSettings';
import { UseAdventureChatActionsParams } from './constants';

export function useAdventureChatActions ({
    currentAdventure,
    setCurrentAdventure,
    selectedCharacter: _selectedCharacter,
    setSelectedCharacter,
    message,
    setMessage,
    setShowSettings,
    handleSendMessage
}: UseAdventureChatActionsParams) {
    const handleSettingsClick = useCallback(() => {
        onShowSettings(setShowSettings)();
    }, [setShowSettings]);

    const handleBackFromSettings = useCallback(() => {
        onHideSettings(setShowSettings)();
    }, [setShowSettings]);

    const handleWorldMasterSelectCallback = useCallback(
        (adventure: Adventure) => {
            const selectWorldMaster = handleWorldMasterSelect(setCurrentAdventure);
            selectWorldMaster(adventure);
        },
        [setCurrentAdventure]
    );

    const handleCharacterSelectCallback = useCallback(
        (character: Character) => {
            const selectCharacter = handleCharacterSelect(setSelectedCharacter);
            selectCharacter(character);
        },
        [setSelectedCharacter]
    );

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
        handleSettingsClick,
        handleBackFromSettings,
        handleWorldMasterSelect: handleWorldMasterSelectCallback,
        handleCharacterSelect: handleCharacterSelectCallback,
        onDeleteMessage,
        handleKeyPress
    };
}
