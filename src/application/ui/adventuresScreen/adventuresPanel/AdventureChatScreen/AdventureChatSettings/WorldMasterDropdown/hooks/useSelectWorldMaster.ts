import { useCallback } from 'react';
import { Alert } from 'react-native';
import { WorldMaster } from '@domain/entities';
import { editAdventureController } from '@infra/container';
import { UseSelectWorldMasterParams } from './constants';

export function useSelectWorldMaster ({
    adventure,
    onWorldMasterSelect,
    closeList
}: UseSelectWorldMasterParams) {
    const handleWorldMasterSelect = useCallback(async (worldMaster: WorldMaster) => {
        const controller = editAdventureController();
        const response = await controller.handle({
            id: adventure.id,
            name: adventure.name,
            systemPromptIds: adventure.systemPromptIds,
            characterIds: adventure.characterIds,
            worldMasterId: worldMaster.id,
            characterAsWorldMasterId: adventure.characterAsWorldMasterId,
            charactersControlledByAi: adventure.charactersControlledByAi,
            worldIds: adventure.worldIds,
            locationIds: adventure.locationIds,
            itemIds: adventure.itemIds,
            chat: adventure.chat,
            createdAt: adventure.createdAt,
        });

        if (!response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to update world master');
            return;
        }

        if (response.adventure) {
            onWorldMasterSelect(response.adventure);
        }
        closeList();
    }, [adventure, onWorldMasterSelect, closeList]);

    return { handleWorldMasterSelect };
}
