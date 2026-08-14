import { useState, useCallback } from 'react';
import { WorldMaster } from '@domain/entities';

export function useDropdownVisibility () {
    const [showList, setShowList] = useState(false);
    const [allWorldMasters, setAllWorldMasters] = useState<WorldMaster[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    const toggleList = useCallback(() => {
        setShowList(prev => !prev);
    }, []);

    const closeList = useCallback(() => {
        setShowList(false);
        setIsAdding(false);
        setAllWorldMasters([]);
    }, []);

    const startAdding = useCallback(() => {
        setIsAdding(true);
    }, []);

    const setWorldMasters = useCallback((masters: WorldMaster[]) => {
        setAllWorldMasters(masters);
    }, []);

    return {
        showList,
        isAdding,
        allWorldMasters,
        toggleList,
        closeList,
        startAdding,
        setWorldMasters
    };
}
