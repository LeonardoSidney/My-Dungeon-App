import { useCallback, useEffect, useState } from 'react';
import {
    IAlertController,
    IGetSceneContextEnabledController,
    ISaveSceneContextEnabledController,
} from '@domain/controllers';
import { DEFAULT_SCENE_CONTEXT_ENABLED } from '@domain/use-cases';
import { showError } from '@presentation/utils/showError';

type UseSceneContextEnabledParams = {
    getSceneContextEnabled: IGetSceneContextEnabledController;
    saveSceneContextEnabled: ISaveSceneContextEnabledController;
    alert: IAlertController;
};

export function useSceneContextEnabled ({
    getSceneContextEnabled,
    saveSceneContextEnabled,
    alert,
}: UseSceneContextEnabledParams) {
    const [sceneContextEnabled, setSceneContextEnabled] = useState(DEFAULT_SCENE_CONTEXT_ENABLED);

    useEffect(() => {
        let isActive = true;

        getSceneContextEnabled.handle().then(response => {
            if (!isActive || !response.success || response.sceneContextEnabled === undefined) {
                return;
            }

            setSceneContextEnabled(response.sceneContextEnabled);
        });

        return () => {
            isActive = false;
        };
    }, [getSceneContextEnabled]);

    const changeSceneContextEnabled = useCallback(async (enabled: boolean) => {
        setSceneContextEnabled(enabled);
        const response = await saveSceneContextEnabled.handle({ sceneContextEnabled: enabled });
        if (!response.success) {
            setSceneContextEnabled(!enabled);
            showError(alert, response.error, 'Failed to save the scene context setting');
        }
    }, [saveSceneContextEnabled, alert]);

    return { sceneContextEnabled, changeSceneContextEnabled };
}
