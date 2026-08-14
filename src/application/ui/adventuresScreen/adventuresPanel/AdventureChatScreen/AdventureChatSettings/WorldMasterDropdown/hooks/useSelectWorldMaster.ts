import { useCallback } from 'react';
import { WorldMaster } from '@domain/entities';
import { editAdventureController } from '@infra/container';
import { UseSelectWorldMasterParams } from './constants';

export function useSelectWorldMaster ({
    adventure,
    onWorldMasterSelect,
    closeList
}: UseSelectWorldMasterParams) {
    const handleWorldMasterSelect = useCallback(async (worldMaster: WorldMaster) => {
        const updatedAdventure = { ...adventure, worldMaster };

        if (updatedAdventure.id) {
            const controller = editAdventureController();
            const response = await controller.handle({
                id: updatedAdventure.id,
                name: updatedAdventure.name,
                systemPrompts: updatedAdventure.systemPrompts,
                characters: updatedAdventure.characters,
                worldMaster: updatedAdventure.worldMaster,
                worlds: updatedAdventure.worlds,
                locations: updatedAdventure.locations,
                items: updatedAdventure.items,
                chat: updatedAdventure.chat,
                createdAt: updatedAdventure.createdAt,
            });

            if (response.adventure) {
                onWorldMasterSelect(response.adventure);
            }
        }
        closeList();
    }, [adventure, onWorldMasterSelect, closeList]);

    return { handleWorldMasterSelect };
}
