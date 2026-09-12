import { UseAdventureChatStateParams } from './constants';
import { useAdventureState } from './useAdventureState';
import { useMessageState } from './useMessageState';
import { useCharacterSelection } from './useCharacterSelection';
import { useSettingsVisibility } from './useSettingsVisibility';

export function useAdventureChatState ({ adventure, hydratedCharacters }: UseAdventureChatStateParams) {
    const { currentAdventure, setCurrentAdventure } = useAdventureState({ adventure });
    const { message, setMessage } = useMessageState();
    const { selectedCharacter, setSelectedCharacter } = useCharacterSelection({ characters: hydratedCharacters });
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
