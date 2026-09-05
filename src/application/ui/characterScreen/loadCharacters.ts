import { IGetCharactersController } from '@domain/controllers';
import { Dispatch, SetStateAction } from 'react';
import { Character } from '@domain/entities';

export async function loadCharacters (
    getCharacters: IGetCharactersController,
    setCharacters: Dispatch<SetStateAction<Character[]>>
) {
    try {
        const result = await getCharacters.handle();
        setCharacters(result);
    } catch (error) {
        console.error('Failed to load characters:', error);
    }
}
