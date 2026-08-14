import { AdventureFormData } from '../constants';
import { Character } from '@domain/entities';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';
import { getCharactersWithFlags } from './getCharactersWithFlags';

export async function onSubmit (formData: AdventureFormData) {
    const allCharacters: Character[] = [...formData.characters];
    if (formData.characterAsWorldMasterId) {
        const worldMasterCharacter = formData.avaliableCharacters.find(c => c.id === formData.characterAsWorldMasterId);
        if (worldMasterCharacter && !allCharacters.some(c => c.id === worldMasterCharacter.id)) {
            allCharacters.push(worldMasterCharacter);
        }
    }

    for (const charId of formData.charactersControlledByAi) {
        const aiCharacter = formData.avaliableCharacters.find(c => c.id === charId);
        if (aiCharacter && !allCharacters.some(c => c.id === aiCharacter.id)) {
            allCharacters.push(aiCharacter);
        }
    }

    const charactersWithFlags = getCharactersWithFlags(
        allCharacters,
        formData.characterAsWorldMasterId,
        formData.charactersControlledByAi
    );

    const updatedFormData = { ...formData, characters: charactersWithFlags };

    if (formData.id) {
        return onEdit(updatedFormData);
    }

    return onCreate(updatedFormData);
}
