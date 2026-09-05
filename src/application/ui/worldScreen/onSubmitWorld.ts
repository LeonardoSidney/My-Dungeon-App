import { Alert } from 'react-native';
import { ICreateWorldController, IEditWorldController } from '@domain/controllers';
import { WorldFormData } from './constants';
import { onCreateWorld } from './onCreateWorld';
import { onEditWorld } from './onEditWorld';

export async function onSubmitWorld (
    formData: WorldFormData,
    createWorld: ICreateWorldController,
    editWorld: IEditWorldController
) {
    if (formData.id) {
        const response = await onEditWorld(formData, editWorld);
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save world');
        }
        return response;
    }

    const response = await onCreateWorld(formData, createWorld);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create world');
    }
    return response;
}
