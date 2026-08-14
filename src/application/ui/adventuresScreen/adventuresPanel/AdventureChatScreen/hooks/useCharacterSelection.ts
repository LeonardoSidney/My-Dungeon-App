import { useState } from 'react';
import { Character } from '@domain/entities';

interface UseCharacterSelectionParams {
    characters: Character[];
}

export function useCharacterSelection ({ characters }: UseCharacterSelectionParams) {
    if (characters.length === 0) {
        throw new Error('useCharacterSelection requires at least one character');
    }

    const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0]);

    return {
        selectedCharacter,
        setSelectedCharacter
    };
}
