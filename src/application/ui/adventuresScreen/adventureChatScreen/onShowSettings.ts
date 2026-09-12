import { Dispatch, SetStateAction } from 'react';

export function onShowSettings (setShowSettings: Dispatch<SetStateAction<boolean>>) {
    return () => {
        setShowSettings(true);
    };
}
