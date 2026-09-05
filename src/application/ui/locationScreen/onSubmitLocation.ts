import { Alert } from 'react-native';
import { ICreateLocationController, IEditLocationController } from '@domain/controllers';
import { LocationFormData } from './constants';
import { onCreateLocation } from './onCreateLocation';
import { onEditLocation } from './onEditLocation';

export async function onSubmitLocation (
    formData: LocationFormData,
    createLocation: ICreateLocationController,
    editLocation: IEditLocationController
) {
    if (formData.id) {
        const response = await onEditLocation(formData, editLocation);
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save location');
        }
        return response;
    }

    const response = await onCreateLocation(formData, createLocation);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create location');
    }
    return response;
}
