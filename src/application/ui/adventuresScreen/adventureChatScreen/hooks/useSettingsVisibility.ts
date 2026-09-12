import { useState } from 'react';

export function useSettingsVisibility () {
    const [showSettings, setShowSettings] = useState(false);

    return {
        showSettings,
        setShowSettings
    };
}
