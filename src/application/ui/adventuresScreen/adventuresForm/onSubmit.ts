import { Alert } from 'react-native';
import { AdventureFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: AdventureFormData) {
    const characterIdSet = new Set(formData.characters.map(c => c.id));
    for (const charId of formData.charactersControlledByAi) {
        characterIdSet.add(charId);
    }
    if (formData.characterAsWorldMasterId) {
        characterIdSet.add(formData.characterAsWorldMasterId);
    }

    const availableById = new Map(formData.availableCharacters.map(c => [c.id, c]));
    const allCharacters = [...characterIdSet]
        .map(id => availableById.get(id))
        .filter(c => c !== undefined);

    const updatedFormData = { ...formData, characters: allCharacters };

    if (formData.id) {
        const response = await onEdit(updatedFormData);
        if (response && !response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save adventure');
        }
        return response;
    }

    const response = await onCreate(updatedFormData);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create adventure');
    }
    return response;
}
