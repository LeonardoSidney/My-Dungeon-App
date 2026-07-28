import { AdventureFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';
import { getCharactersWithFlags } from './getCharactersWithFlags';

export async function onSubmit (formData: AdventureFormData) {
    const charactersWithFlags = getCharactersWithFlags(
        formData.avaliableCharacters,
        formData.characterAsWorldMasterId
    );

    const updatedFormData = { ...formData, characters: charactersWithFlags };

    if (formData.id) {
        return onEdit(updatedFormData);
    }

    return onCreate(updatedFormData);
}
