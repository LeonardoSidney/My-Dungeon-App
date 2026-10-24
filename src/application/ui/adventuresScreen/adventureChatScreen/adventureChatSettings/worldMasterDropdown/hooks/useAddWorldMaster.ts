import { useCallback } from 'react';
import { UseAddWorldMasterParams } from './constants';

export function useAddWorldMaster ({
    adventureWorldMasterId,
    setWorldMasters,
    startAdding,
    getWorldMasters
}: UseAddWorldMasterParams) {
    const handleAddWorldMaster = useCallback(async () => {
        const response = await getWorldMasters.handle();
        if (!response.success || !response.items) {
            console.error('Error loading world masters:', response.error);
            return;
        }

        setWorldMasters(response.items
            .filter(wm => wm.id !== adventureWorldMasterId)
            .map(wm => ({ id: wm.id, name: wm.name })));
        startAdding();
    }, [adventureWorldMasterId, setWorldMasters, startAdding, getWorldMasters]);

    return { handleAddWorldMaster };
}
