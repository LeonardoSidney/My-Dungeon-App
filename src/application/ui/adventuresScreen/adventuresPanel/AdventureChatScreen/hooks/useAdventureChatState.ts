import { UseAdventureChatStateParams } from './constants';
import { useAdventureState } from './useAdventureState';
import { useMessageState } from './useMessageState';
import { useCharacterSelection } from './useCharacterSelection';
import { useSettingsVisibility } from './useSettingsVisibility';

export function useAdventureChatState ({ adventure }: UseAdventureChatStateParams) {
    const { currentAdventure, setCurrentAdventure } = useAdventureState({ adventure });
    const { message, setMessage } = useMessageState();
    const { selectedCharacter, setSelectedCharacter } = useCharacterSelection({ characters: adventure.characters });
    const { showSettings, setShowSettings } = useSettingsVisibility();

    return {
        currentAdventure,
        message,
        selectedCharacter,
        showSettings,
        setCurrentAdventure,
        setMessage,
        setSelectedCharacter,
        setShowSettings
    };
}
