import { Alert } from 'react-native';
import { ICreateAbilityController, IEditAbilityController } from '@domain/controllers';
import { AbilityFormData } from './constants';
import { onCreateAbility } from './onCreateAbility';
import { onEditAbility } from './onEditAbility';

export async function onSubmitAbility (
    formData: AbilityFormData,
    createAbility: ICreateAbilityController,
    editAbility: IEditAbilityController
) {
    if (formData.id) {
        const response = await onEditAbility(formData, editAbility);
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save ability');
        }
        return response;
    }

    const response = await onCreateAbility(formData, createAbility);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create ability');
    }
    return response;
}
