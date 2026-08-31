import { Alert } from 'react-native';
import { StatusFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: StatusFormData) {
    if (!formData.name.trim()) {
        Alert.alert('Erro', 'Name is required');
        return;
    }
    if (!formData.activationWord.trim()) {
        Alert.alert('Erro', 'Activation Word is required');
        return;
    }
    if (!formData.prompt.trim()) {
        Alert.alert('Erro', 'Prompt is required');
        return;
    }

    if (formData.id) {
        const response = await onEdit(formData);
        if (response && !response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save status');
        }
        return response;
    }

    const response = await onCreate(formData);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create status');
    }
    return response;
}
