import { Alert } from 'react-native';
import { WorldFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: WorldFormData) {
    if (formData.id) {
        const response = await onEdit(formData);
        if (response && !response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save world');
        }
        return response;
    }

    const response = await onCreate(formData);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create world');
    }
    return response;
}
