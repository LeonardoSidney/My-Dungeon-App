import { Character } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseCharacterController } from '@infra/container';
import { loadCharacters } from './loadCharacters';

export async function onEraseCharacter (
    character: Character,
    setCharacters: Dispatch<SetStateAction<Character[]>>
) {
    try {
        const ctrl = eraseCharacterController();
        await ctrl.handle(character.id);
        await loadCharacters(setCharacters);
    } catch (error) {
        console.error('Failed to delete character:', error);
    }
}
