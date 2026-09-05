import { Alert } from 'react-native';
import { ICreateStatusController, IEditStatusController } from '@domain/controllers';
import { StatusFormData } from './constants';
import { onCreateStatus } from './onCreateStatus';
import { onEditStatus } from './onEditStatus';

export async function onSubmitStatus (
    formData: StatusFormData,
    createStatus: ICreateStatusController,
    editStatus: IEditStatusController
) {
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
        const response = await onEditStatus(formData, editStatus);
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save status');
        }
        return response;
    }

    const response = await onCreateStatus(formData, createStatus);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create status');
    }
    return response;
}
