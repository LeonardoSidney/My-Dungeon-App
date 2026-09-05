import { Alert } from 'react-native';
import { ICreateAssistantController, IEditAssistantController } from '@domain/controllers';
import { AssistantFormData } from './constants';
import { onCreateAssistant } from './onCreateAssistant';
import { onEditAssistant } from './onEditAssistant';

export async function onSubmitAssistant (
    formData: AssistantFormData,
    createAssistant: ICreateAssistantController,
    editAssistant: IEditAssistantController
) {
    if (formData.id) {
        const response = await onEditAssistant(formData, editAssistant);
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save assistant');
        }
        return response;
    }

    const response = await onCreateAssistant(formData, createAssistant);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create assistant');
    }
    return response;
}
