import { useCallback } from 'react';
import { WorldMaster } from '@domain/entities';
import { UseSelectWorldMasterParams } from './constants';

export function useSelectWorldMaster ({
    adventure,
    onWorldMasterSelect,
    closeList,
    editAdventure,
    alert
}: UseSelectWorldMasterParams) {
    const handleWorldMasterSelect = useCallback(async (worldMaster: WorldMaster) => {
        const response = await editAdventure.handle({
            id: adventure.id,
            editParams: {
                name: adventure.name,
                systemPromptIds: adventure.systemPromptIds,
                characterIds: adventure.characterIds,
                worldMasterId: worldMaster.id,
                characterAsWorldMasterId: undefined,
                charactersControlledByAi: adventure.charactersControlledByAi,
                worldIds: adventure.worldIds,
                locationIds: adventure.locationIds,
                itemIds: adventure.itemIds,
                chat: adventure.chat,
            },
        });

        if (!response.success) {
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to update world master' });
            return;
        }

        if (response.adventure) {
            onWorldMasterSelect(response.adventure);
        }
        closeList();
    }, [adventure, onWorldMasterSelect, closeList, editAdventure, alert]);

    return { handleWorldMasterSelect };
}
