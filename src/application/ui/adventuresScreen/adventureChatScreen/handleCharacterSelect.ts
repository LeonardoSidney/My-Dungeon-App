import { Character } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';

export function handleCharacterSelect (
    setSelectedCharacter: Dispatch<SetStateAction<Character>>
) {
    return (character: Character) => {
        setSelectedCharacter(character);
    };
}
