import { useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { onHideSettings } from '../onHideSettings';
import { onShowSettings } from '../onShowSettings';

interface UseSettingsActionsParams {
    setShowSettings: Dispatch<SetStateAction<boolean>>;
}

export function useSettingsActions ({ setShowSettings }: UseSettingsActionsParams) {
    const handleSettingsClick = useCallback(() => {
        onShowSettings(setShowSettings)();
    }, [setShowSettings]);

    const handleBackFromSettings = useCallback(() => {
        onHideSettings(setShowSettings)();
    }, [setShowSettings]);

    return {
        handleSettingsClick,
        handleBackFromSettings
    };
}
