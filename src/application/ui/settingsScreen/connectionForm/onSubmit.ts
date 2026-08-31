import { Alert } from 'react-native';
import { ConnectionFormData } from '../constants';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: ConnectionFormData, getPortNumber: () => number | undefined) {
    if (!formData.name.trim()) {
        Alert.alert('Erro', 'Name is required');
        return;
    }
    if (!formData.ip.trim()) {
        Alert.alert('Erro', 'IP Address is required');
        return;
    }
    if (!formData.port.trim()) {
        Alert.alert('Erro', 'Port is required');
        return;
    }

    if (formData.id) {
        const response = await onEdit(formData, getPortNumber);
        if (response && !response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save connection');
        }
        return response;
    }

    const response = await onCreate(formData, getPortNumber);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create connection');
    }
    return response;
}
