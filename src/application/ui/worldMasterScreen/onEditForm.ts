import { Assistant, WorldMaster } from '@domain/entities';
import { WorldMasterFormData } from './constants';

export function onEditForm (
    worldMaster: WorldMaster,
    assistants: Assistant[],
    setShowForm: (show: boolean) => void,
    setWorldMasterFormData: (updater: WorldMasterFormData) => void
) {
    const validAssistant = worldMaster.assistant
        ? (assistants.find(a => a.id === worldMaster.assistant.id) ?? null)
        : null;

    setWorldMasterFormData({
        id: worldMaster.id,
        name: worldMaster.name,
        activationWord: worldMaster.activationWord,
        prompt: worldMaster.prompt,
        observation: worldMaster.observation || '',
        assistant: validAssistant,
    });
    setShowForm(true);
}
