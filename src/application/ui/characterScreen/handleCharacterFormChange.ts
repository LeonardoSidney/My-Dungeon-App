import { Dispatch, SetStateAction } from 'react';
import { CharacterFormData } from './constants';

export function handleCharacterFormChange (
    setCharacterFormData: Dispatch<SetStateAction<CharacterFormData>>,
) {
    return (field: keyof CharacterFormData, value: CharacterFormData[keyof CharacterFormData]) => {
        setCharacterFormData((prev) => ({ ...prev, [field]: value }));
    };
}
