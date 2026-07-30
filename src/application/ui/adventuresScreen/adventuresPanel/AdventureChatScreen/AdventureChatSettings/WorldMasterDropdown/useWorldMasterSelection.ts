import { useState, useEffect } from 'react';
import { WorldMaster } from '@domain/entities';
import { getWorldMasterController } from '@infra/container';

interface UseWorldMasterSelectionProps {
    onSelect?: (worldMaster: WorldMaster | undefined) => void;
}

export function useWorldMasterSelection(params?: UseWorldMasterSelectionProps) {
    const { onSelect } = params || {};
    const [worldMasters, setWorldMasters] = useState<WorldMaster[]>([]);
    const [showList, setShowList] = useState(false);
    const [prevShowList, setPrevShowList] = useState(false);

    useEffect(() => {
        loadWorldMasters();
    }, []);

    useEffect(() => {
        if (prevShowList && !showList) {
            setPrevShowList(false);
        }
        if (showList !== prevShowList) {
            setPrevShowList(showList);
        }
    }, [showList, prevShowList]);

    async function loadWorldMasters() {
        const controller = getWorldMasterController();
        try {
            const response = await controller.handle();
            if (Array.isArray(response)) {
                setWorldMasters(response);
            }
        } catch (error) {
            console.error('Error loading world masters:', error);
        }
    }

    function toggleList() {
        setShowList(!showList);
    }

    function selectWorldMaster(worldMaster: WorldMaster) {
        setShowList(false);
        if (onSelect) {
            onSelect(worldMaster);
        }
        return worldMaster;
    }

    return {
        worldMasters,
        showList,
        toggleList,
        selectWorldMaster,
    };
}
