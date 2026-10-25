import { AdventureChatCharacter } from '@domain/controllers';
import { Dispatch, SetStateAction } from 'react';

export function handleCharacterSelect (
    setSelectedCharacter: Dispatch<SetStateAction<AdventureChatCharacter>>
) {
    return (character: AdventureChatCharacter) => {
        setSelectedCharacter(character);
    };
}
