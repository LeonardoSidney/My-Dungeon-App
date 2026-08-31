import { Alert } from 'react-native';
import { Character } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseCharacterController } from '@infra/container';
import { loadCharacters } from './loadCharacters';

export async function onEraseCharacter (
    character: Character,
    setCharacters: Dispatch<SetStateAction<Character[]>>
) {
    const ctrl = eraseCharacterController();
    const response = await ctrl.handle(character.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to delete character');
        return;
    }
    await loadCharacters(setCharacters);
}
