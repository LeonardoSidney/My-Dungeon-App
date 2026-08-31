import { Alert } from 'react-native';
import { WorldMaster, Assistant } from '@domain/entities';
import { WorldMasterFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { createWorldMasterController, editWorldMasterController } from '@infra/container';
import { loadWorldMasters } from './loadWorldMasters';
import { setInitialWorldMasterState } from './setInitialWorldMasterState';

export async function onSaveWorldMaster (
    worldMasterFormData: WorldMasterFormData,
    setWorldMasterFormData: Dispatch<SetStateAction<WorldMasterFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setWorldMasters: Dispatch<SetStateAction<WorldMaster[]>>,
    _assistants: Assistant[]
) {
    const { id, name, activationWord, prompt, observation, assistant } = worldMasterFormData;

    const trimmedName = name.trim();
    const trimmedActivationWord = activationWord.trim();
    const trimmedPrompt = prompt.trim();
    const trimmedObservation = observation.trim() || undefined;

    if (!trimmedName || !trimmedActivationWord || !trimmedPrompt) return;
    if (!assistant) return;

    let saveResponse;
    if (id) {
        const ctrl = editWorldMasterController();
        saveResponse = await ctrl.handle({
            id,
            name: trimmedName,
            activationWord: trimmedActivationWord,
            prompt: trimmedPrompt,
            observation: trimmedObservation,
            assistantId: assistant.id,
            createdAt: new Date(),
        });
    }

    if (!id) {
        const ctrl = createWorldMasterController();
        saveResponse = await ctrl.handle({
            name: trimmedName,
            activationWord: trimmedActivationWord,
            prompt: trimmedPrompt,
            observation: trimmedObservation,
            assistantId: assistant.id,
        });
    }

    if (!saveResponse || !saveResponse.success) {
        Alert.alert('Erro', saveResponse?.error ?? 'Failed to save world master');
        return;
    }

    await loadWorldMasters(setWorldMasters);
    setShowForm(false);
    setWorldMasterFormData(setInitialWorldMasterState());
}
