import { Alert } from 'react-native';
import { ICreateWorldMasterController, IEditWorldMasterController } from '@domain/controllers';
import { WorldMasterFormData } from './constants';
import { onCreateWorldMaster } from './onCreateWorldMaster';
import { onEditWorldMaster } from './onEditWorldMaster';

export async function onSubmitWorldMaster (
    formData: WorldMasterFormData,
    createWorldMaster: ICreateWorldMasterController,
    editWorldMaster: IEditWorldMasterController
) {
    if (formData.id) {
        const response = await onEditWorldMaster(formData, editWorldMaster);
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save world master');
        }
        return response;
    }

    const response = await onCreateWorldMaster(formData, createWorldMaster);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create world master');
    }
    return response;
}
