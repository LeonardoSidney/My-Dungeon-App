import { useState, useCallback } from 'react';
import { AdventureChatWorldMaster } from '@domain/controllers';

export function useDropdownVisibility () {
    const [showList, setShowList] = useState(false);
    const [allWorldMasters, setAllWorldMasters] = useState<AdventureChatWorldMaster[]>([]);
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

    const setWorldMasters = useCallback((masters: AdventureChatWorldMaster[]) => {
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
