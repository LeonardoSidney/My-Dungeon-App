import { Alert } from 'react-native';
import { ICreateCharacterController, IEditCharacterController } from '@domain/controllers';
import { CharacterFormData } from './constants';
import { onCreateCharacter } from './onCreateCharacter';
import { onEditCharacter } from './onEditCharacter';

export async function onSubmitCharacter (
    formData: CharacterFormData,
    createCharacter: ICreateCharacterController,
    editCharacter: IEditCharacterController
) {
    if (formData.id) {
        const response = await onEditCharacter(formData, editCharacter);
        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save character');
        }
        return response;
    }

    const response = await onCreateCharacter(formData, createCharacter);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create character');
    }
    return response;
}
