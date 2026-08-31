import { Alert } from 'react-native';
import { Assistant } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseAssistantController } from '@infra/container';
import { loadAssistants } from './loadAssistants';

export async function onEraseAssistant (
    assistant: Assistant,
    setAssistants: Dispatch<SetStateAction<Assistant[]>>
) {
    const ctrl = eraseAssistantController();
    const response = await ctrl.handle(assistant.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to delete assistant');
        return;
    }
    await loadAssistants(setAssistants);
}
