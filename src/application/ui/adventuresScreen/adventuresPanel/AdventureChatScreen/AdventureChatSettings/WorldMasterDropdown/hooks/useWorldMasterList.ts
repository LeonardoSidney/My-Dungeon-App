import { useState, useEffect, useCallback } from 'react';
import { WorldMaster } from '@domain/entities';
import { getWorldMasterController } from '@infra/container';

export function useWorldMasterList () {
    const [worldMasters, setWorldMasters] = useState<WorldMaster[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadWorldMasters = useCallback(async () => {
        setIsLoading(true);
        const controller = getWorldMasterController();
        try {
            const response = await controller.handle();
            if (Array.isArray(response)) {
                setWorldMasters(response);
            }
        } catch (error) {
            console.error('Error loading world masters:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadWorldMasters();
    }, [loadWorldMasters]);

    return {
        worldMasters,
        isLoading,
        loadWorldMasters,
        setWorldMasters
    };
}
