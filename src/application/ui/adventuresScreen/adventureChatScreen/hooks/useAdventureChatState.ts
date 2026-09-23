import { UseAdventureChatStateParams } from './constants';
import { useMessageState } from './useMessageState';
import { useCharacterSelection } from './useCharacterSelection';
import { useSettingsVisibility } from './useSettingsVisibility';

export function useAdventureChatState ({ hydratedCharacters }: UseAdventureChatStateParams) {
    const { message, setMessage } = useMessageState();
    const { selectedCharacter, setSelectedCharacter } = useCharacterSelection({ characters: hydratedCharacters });
    const { showSettings, setShowSettings } = useSettingsVisibility();

    return {
        message,
        selectedCharacter,
        showSettings,
        setMessage,
        setSelectedCharacter,
        setShowSettings
    };
}
