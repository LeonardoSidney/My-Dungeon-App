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

    try {
        if (id) {
            const ctrl = editWorldMasterController();
            await ctrl.handle({
                id,
                name: trimmedName,
                activationWord: trimmedActivationWord,
                prompt: trimmedPrompt,
                observation: trimmedObservation,
                assistant,
                createdAt: new Date(),
            });
        }

        if (!id) {
            const ctrl = createWorldMasterController();
            await ctrl.handle({
                name: trimmedName,
                activationWord: trimmedActivationWord,
                prompt: trimmedPrompt,
                observation: trimmedObservation,
                assistant,
            });
        }

        await loadWorldMasters(setWorldMasters);
    } catch (error) {
        console.error('Failed to save world master:', error);
    }

    setShowForm(false);
    setWorldMasterFormData(setInitialWorldMasterState());
}
