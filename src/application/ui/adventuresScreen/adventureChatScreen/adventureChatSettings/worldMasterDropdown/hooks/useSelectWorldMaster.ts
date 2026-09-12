import { useCallback } from 'react';
import { Alert } from 'react-native';
import { WorldMaster } from '@domain/entities';
import { UseSelectWorldMasterParams } from './constants';

export function useSelectWorldMaster ({
    adventure,
    onWorldMasterSelect,
    closeList,
    editAdventure
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
            Alert.alert('Erro', response.error ?? 'Failed to update world master');
            return;
        }

        if (response.adventure) {
            onWorldMasterSelect(response.adventure);
        }
        closeList();
    }, [adventure, onWorldMasterSelect, closeList, editAdventure]);

    return { handleWorldMasterSelect };
}
