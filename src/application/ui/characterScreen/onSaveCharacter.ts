import { Dispatch, SetStateAction } from 'react';
import { Character } from '@domain/entities';
import { loadCharacters } from './loadCharacters';
import { onSubmit } from './characterForm';
import { CharacterFormData } from './constants';
import { setInitialCharacterState } from './setInitialCharacterState';

export async function onSaveCharacter (
    characterStateFormData: CharacterFormData,
    setCharacterFormData: Dispatch<SetStateAction<CharacterFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setCharacters: Dispatch<SetStateAction<Character[]>>
) {
    if (!characterStateFormData.name.trim()) return;
    if (!characterStateFormData.activationWord.trim()) return;
    if (!characterStateFormData.prompt.trim()) return;
    if (!characterStateFormData.assistant) return;

    try {
        await onSubmit(characterStateFormData);
        setCharacterFormData(setInitialCharacterState());
        setShowForm(false);
        await loadCharacters(setCharacters);
    } catch (error) {
        console.error('Failed to save character:', error);
    }
}
