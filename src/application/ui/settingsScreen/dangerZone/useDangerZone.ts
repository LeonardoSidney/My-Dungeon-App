import { useState } from 'react';
import { eraseAdventuresController } from '@infra/container';

export function useDangerZone () {
    const [expanded, setExpanded] = useState(false);
    const [erasing, setErasing] = useState(false);

    const handleErase = async () => {
        setErasing(true);
        try {
            const ctrl = eraseAdventuresController();
            await ctrl.handle();
        } catch (error) {
            console.error('Failed to erase adventures:', error);
        } finally {
            setErasing(false);
        }
    };

    return {
        expanded,
        setExpanded,
        erasing,
        handleErase,
    };
}
