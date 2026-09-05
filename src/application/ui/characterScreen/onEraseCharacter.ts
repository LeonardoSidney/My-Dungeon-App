import { Alert } from 'react-native';
import { IEraseCharacterController, IGetCharactersController } from '@domain/controllers';
import { Character } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadCharacters } from './loadCharacters';

export async function onEraseCharacter (
    character: Character,
    eraseCharacter: IEraseCharacterController,
    getCharacters: IGetCharactersController,
    setCharacters: Dispatch<SetStateAction<Character[]>>
) {
    const response = await eraseCharacter.handle(character.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to delete character');
        return;
    }
    await loadCharacters(getCharacters, setCharacters);
}
