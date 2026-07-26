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

    if (!name.trim() || !activationWord.trim() || !prompt.trim()) return;
    if (!assistant) return;

    try {
        if (id) {
            // Edit existing world master
            const ctrl = editWorldMasterController();
            await ctrl.handle({
                id,
                name: name.trim(),
                activationWord: activationWord.trim(),
                prompt: prompt.trim(),
                observation: observation.trim() || undefined,
                assistant: assistant,
                createdAt: new Date(),
            });
        } else {
            // Create new world master
            const ctrl = createWorldMasterController();
            await ctrl.handle({
                name: name.trim(),
                activationWord: activationWord.trim(),
                prompt: prompt.trim(),
                observation: observation.trim() || undefined,
                assistant: assistant,
            });
        }

        await loadWorldMasters(setWorldMasters);
    } catch (error) {
        console.error('Failed to save world master:', error);
    }

    setShowForm(false);
    setWorldMasterFormData(setInitialWorldMasterState());
}
