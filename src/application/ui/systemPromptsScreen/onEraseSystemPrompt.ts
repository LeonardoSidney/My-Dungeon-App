import { Alert } from 'react-native';
import { SystemPrompt } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { onErase } from './systemPromptForm/onErase';
import { loadSystemPrompts } from './loadSystemPrompts';

export async function onEraseSystemPrompt (
    systemPrompt: SystemPrompt,
    setSystemPrompts: Dispatch<SetStateAction<SystemPrompt[]>>
) {
    const response = await onErase(systemPrompt.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase system prompt');
        return;
    }
    await loadSystemPrompts(setSystemPrompts);
}
