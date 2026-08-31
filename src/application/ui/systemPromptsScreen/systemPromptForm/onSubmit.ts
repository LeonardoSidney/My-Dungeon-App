import { Alert } from 'react-native';
import { SystemPromptFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: SystemPromptFormData) {
    if (!formData.name.trim()) {
        Alert.alert('Erro', 'Name is required');
        return;
    }
    if (!formData.content.trim()) {
        Alert.alert('Erro', 'Content is required');
        return;
    }

    if (formData.id) {
        const response = await onEdit(formData);
        if (response && !response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save system prompt');
        }
        return response;
    }

    const response = await onCreate(formData);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create system prompt');
    }
    return response;
}
