import { getCharactersController } from '@infra/container';
import { Dispatch } from 'react';
import { Character } from '@domain/entities';

export async function loadCharacters(
    setCharacters: Dispatch<React.SetStateAction<Character[]>>
) {
    try {
        const ctrl = getCharactersController();
        const result = await ctrl.handle();
        setCharacters(result);
    } catch (error) {
        console.error('Failed to load characters:', error);
    }
}
