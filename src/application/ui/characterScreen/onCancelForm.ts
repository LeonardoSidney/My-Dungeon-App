import { Dispatch, SetStateAction } from 'react';
import { CharacterFormData } from './constants';
import { setInitialCharacterState } from './setInitialCharacterState';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setCharacterFormData: Dispatch<SetStateAction<CharacterFormData>>
) {
    setShowForm(false);
    setCharacterFormData(setInitialCharacterState());
}
