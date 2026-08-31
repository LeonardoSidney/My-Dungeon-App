import { Alert } from 'react-native';
import { AssistantFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: AssistantFormData) {
    if (!formData.name.trim()) {
        Alert.alert('Erro', 'Name is required');
        return;
    }
    if (!formData.model) {
        Alert.alert('Erro', 'Model is required');
        return;
    }
    if (!formData.sampler) {
        Alert.alert('Erro', 'Sampler is required');
        return;
    }

    if (formData.id) {
        const response = await onEdit(formData);
        if (!response) return;
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save assistant');
        }
        return response;
    }

    const response = await onCreate(formData);
    if (!response) return;
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create assistant');
    }
    return response;
}
