import { Dispatch, SetStateAction, useEffect } from 'react';
import { Character } from '@domain/entities';
import { loadCharacters } from './loadCharacters';

export function useCharactersLoad (
    setCharacters: Dispatch<SetStateAction<Character[]>>
) {
    useEffect(() => {
        loadCharacters(setCharacters);
    }, [setCharacters]);
}
