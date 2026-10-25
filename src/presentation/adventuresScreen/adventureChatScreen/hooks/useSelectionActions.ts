import { useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { AdventureChatCharacter } from '@domain/controllers';
import { handleCharacterSelect } from '../handleCharacterSelect';

interface UseSelectionActionsParams {
    setSelectedCharacter: Dispatch<SetStateAction<AdventureChatCharacter>>;
}

export function useSelectionActions ({
    setSelectedCharacter
}: UseSelectionActionsParams) {
    const handleCharacterSelectCallback = useCallback(
        (character: AdventureChatCharacter) => {
            const selectCharacter = handleCharacterSelect(setSelectedCharacter);
            selectCharacter(character);
        },
        [setSelectedCharacter]
    );

    return {
        handleCharacterSelect: handleCharacterSelectCallback
    };
}
