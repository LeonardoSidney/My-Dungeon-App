import { useState } from 'react';

export function useDangerZoneLoad () {
    const [expanded, setExpanded] = useState(false);

    return {
        expanded,
        setExpanded,
    };
}
