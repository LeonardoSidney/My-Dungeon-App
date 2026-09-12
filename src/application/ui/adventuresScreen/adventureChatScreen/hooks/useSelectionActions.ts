import { useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Adventure, Character } from '@domain/entities';
import { handleCharacterSelect } from '../handleCharacterSelect';
import { handleWorldMasterSelect } from '../handleWorldMasterSelect';

interface UseSelectionActionsParams {
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>;
    setSelectedCharacter: Dispatch<SetStateAction<Character>>;
}

export function useSelectionActions ({
    setCurrentAdventure,
    setSelectedCharacter
}: UseSelectionActionsParams) {
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

    return {
        handleWorldMasterSelect: handleWorldMasterSelectCallback,
        handleCharacterSelect: handleCharacterSelectCallback
    };
}
