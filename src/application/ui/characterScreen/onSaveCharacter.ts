import { Dispatch, SetStateAction } from 'react';
import { Character } from '@domain/entities';
import { ICreateCharacterController, IEditCharacterController, IGetCharactersController } from '@domain/controllers';
import { loadCharacters } from './loadCharacters';
import { onSubmitCharacter } from './onSubmitCharacter';
import { CharacterFormData } from './constants';
import { setInitialCharacterState } from './setInitialCharacterState';

export async function onSaveCharacter (
    characterStateFormData: CharacterFormData,
    createCharacter: ICreateCharacterController,
    editCharacter: IEditCharacterController,
    getCharacters: IGetCharactersController,
    setCharacterFormData: Dispatch<SetStateAction<CharacterFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setCharacters: Dispatch<SetStateAction<Character[]>>
) {
    const response = await onSubmitCharacter(characterStateFormData, createCharacter, editCharacter);
    if (!response || !response.success) return;

    setCharacterFormData(setInitialCharacterState());
    setShowForm(false);
    await loadCharacters(getCharacters, setCharacters);
}
