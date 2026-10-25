import { useCallback } from 'react';
import { AdventureChatWorldMaster } from '@domain/controllers';
import { UseSelectWorldMasterParams } from './constants';

export function useSelectWorldMaster ({
    adventureId,
    onWorldMasterChange,
    closeList,
    setAdventureWorldMaster,
    alert
}: UseSelectWorldMasterParams) {
    const handleWorldMasterSelect = useCallback(async (worldMaster: AdventureChatWorldMaster) => {
        const response = await setAdventureWorldMaster.handle({
            adventureId,
            worldMasterId: worldMaster.id,
        });

        if (!response.success) {
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to update world master' });
            return;
        }

        closeList();
        await onWorldMasterChange();
    }, [adventureId, onWorldMasterChange, closeList, setAdventureWorldMaster, alert]);

    return { handleWorldMasterSelect };
}
