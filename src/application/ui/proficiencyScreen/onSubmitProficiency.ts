import { Alert } from 'react-native';
import { ICreateProficiencyController, IEditProficiencyController } from '@domain/controllers';
import { ProficiencyFormData } from './constants';
import { onCreateProficiency } from './onCreateProficiency';
import { onEditProficiency } from './onEditProficiency';

export async function onSubmitProficiency (
    formData: ProficiencyFormData,
    createProficiency: ICreateProficiencyController,
    editProficiency: IEditProficiencyController
) {
    if (formData.id) {
        const response = await onEditProficiency(formData, editProficiency);
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save proficiency');
        }
        return response;
    }

    const response = await onCreateProficiency(formData, createProficiency);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create proficiency');
    }
    return response;
}
