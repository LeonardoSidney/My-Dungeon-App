import { Dispatch, SetStateAction } from 'react';
import { CharacterFormData } from './constants';
import { setInitialCharacterState } from './setInitialCharacterState';

export function onAddNewCharacter (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setCharacterFormData: Dispatch<SetStateAction<CharacterFormData>>
) {
    setShowForm(true);
    setCharacterFormData(setInitialCharacterState());
}
