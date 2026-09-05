import { Alert } from 'react-native';
import { IEraseAssistantController, IGetAssistantsController } from '@domain/controllers';
import { Assistant } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadAssistants } from './loadAssistants';

export async function onEraseAssistant (
    assistant: Assistant,
    eraseAssistant: IEraseAssistantController,
    getAssistants: IGetAssistantsController,
    setAssistants: Dispatch<SetStateAction<Assistant[]>>
) {
    const response = await eraseAssistant.handle(assistant.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to delete assistant');
        return;
    }
    await loadAssistants(getAssistants, setAssistants);
}
