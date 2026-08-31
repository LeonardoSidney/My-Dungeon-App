import { Alert } from 'react-native';
import { AbilityFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: AbilityFormData) {
    if (formData.id) {
        const response = await onEdit(formData);
        if (response && !response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save ability');
        }
        return response;
    }

    const response = await onCreate(formData);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create ability');
    }
    return response;
}
