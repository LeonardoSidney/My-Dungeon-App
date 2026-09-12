import { useCallback } from 'react';
import { UseAddWorldMasterParams } from './constants';

export function useAddWorldMaster ({
    adventureWorldMasterId,
    setWorldMasters,
    startAdding,
    getWorldMasters
}: UseAddWorldMasterParams) {
    const handleAddWorldMaster = useCallback(async () => {
        try {
            const response = await getWorldMasters.handle();
            if (Array.isArray(response)) {
                const filteredMasters = response.filter(wm => wm.id !== adventureWorldMasterId);
                setWorldMasters(filteredMasters);
                startAdding();
            }
        } catch (error) {
            console.error('Error loading world masters:', error);
        }
    }, [adventureWorldMasterId, setWorldMasters, startAdding, getWorldMasters]);

    return { handleAddWorldMaster };
}
