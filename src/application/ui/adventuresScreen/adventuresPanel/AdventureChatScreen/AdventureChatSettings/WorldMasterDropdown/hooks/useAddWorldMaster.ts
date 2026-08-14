import { useCallback } from 'react';
import { getWorldMasterController } from '@infra/container';
import { UseAddWorldMasterParams } from './constants';

export function useAddWorldMaster ({
    adventureWorldMasterId,
    setWorldMasters,
    startAdding
}: UseAddWorldMasterParams) {
    const handleAddWorldMaster = useCallback(async () => {
        try {
            const controller = getWorldMasterController();
            const response = await controller.handle();
            if (Array.isArray(response)) {
                const filteredMasters = response.filter(wm => wm.id !== adventureWorldMasterId);
                setWorldMasters(filteredMasters);
                startAdding();
            }
        } catch (error) {
            console.error('Error loading world masters:', error);
        }
    }, [adventureWorldMasterId, setWorldMasters, startAdding]);

    return { handleAddWorldMaster };
}
