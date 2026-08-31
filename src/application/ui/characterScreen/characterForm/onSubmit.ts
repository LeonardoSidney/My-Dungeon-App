import { Alert } from 'react-native';
import { CharacterFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: CharacterFormData) {
    if (formData.id) {
        const response = await onEdit(formData);
        if (!response) return;
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save character');
        }
        return response;
    }

    const response = await onCreate(formData);
    if (!response) return;
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create character');
    }
    return response;
}
