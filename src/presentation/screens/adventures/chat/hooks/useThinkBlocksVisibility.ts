import { useCallback, useEffect, useState } from 'react';
import {
    IAlertController,
    IGetThinkBlocksVisibilityController,
    ISaveThinkBlocksVisibilityController,
} from '@domain/controllers';
import { DEFAULT_SHOW_THINK_BLOCKS } from '@domain/use-cases';
import { showError } from '@presentation/utils/showError';

type UseThinkBlocksVisibilityParams = {
    getThinkBlocksVisibility: IGetThinkBlocksVisibilityController;
    saveThinkBlocksVisibility: ISaveThinkBlocksVisibilityController;
    alert: IAlertController;
};

export function useThinkBlocksVisibility ({
    getThinkBlocksVisibility,
    saveThinkBlocksVisibility,
    alert,
}: UseThinkBlocksVisibilityParams) {
    const [showThinkBlocks, setShowThinkBlocks] = useState(DEFAULT_SHOW_THINK_BLOCKS);

    useEffect(() => {
        let isActive = true;

        getThinkBlocksVisibility.handle().then(response => {
            if (!isActive || !response.success || response.showThinkBlocks === undefined) {
                return;
            }

            setShowThinkBlocks(response.showThinkBlocks);
        });

        return () => {
            isActive = false;
        };
    }, [getThinkBlocksVisibility]);

    const changeThinkBlocksVisibility = useCallback(async (visible: boolean) => {
        setShowThinkBlocks(visible);
        const response = await saveThinkBlocksVisibility.handle({ showThinkBlocks: visible });
        if (!response.success) {
            setShowThinkBlocks(!visible);
            showError(alert, response.error, 'Failed to save the think blocks visibility');
        }
    }, [saveThinkBlocksVisibility, alert]);

    return { showThinkBlocks, changeThinkBlocksVisibility };
}
