import { Alert } from 'react-native';
import { ICreateItemController, IEditItemController } from '@domain/controllers';
import { ItemFormData } from './constants';
import { onCreateItem } from './onCreateItem';
import { onEditItem } from './onEditItem';

export async function onSubmitItem (
    formData: ItemFormData,
    createItem: ICreateItemController,
    editItem: IEditItemController
) {
    if (formData.id) {
        const response = await onEditItem(formData, editItem);
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save item');
        }
        return response;
    }

    const response = await onCreateItem(formData, createItem);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create item');
    }
    return response;
}
