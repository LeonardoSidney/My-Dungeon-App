import { Dispatch, SetStateAction } from 'react';

export function onHideSettings (setShowSettings: Dispatch<SetStateAction<boolean>>) {
    return () => {
        setShowSettings(false);
    };
}
