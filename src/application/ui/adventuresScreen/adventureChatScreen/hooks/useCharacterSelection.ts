import { useState } from 'react';
import { AdventureChatCharacter } from '@domain/controllers';

interface UseCharacterSelectionParams {
    characters: AdventureChatCharacter[];
}

export function useCharacterSelection ({ characters }: UseCharacterSelectionParams) {
    if (characters.length === 0) {
        throw new Error('useCharacterSelection requires at least one character');
    }

    const [selectedCharacter, setSelectedCharacter] = useState<AdventureChatCharacter>(characters[0]);

    return {
        selectedCharacter,
        setSelectedCharacter
    };
}
