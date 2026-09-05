import { useEffect } from 'react';

export function useEntityScreenLoad (loadEntities: () => Promise<void>): void {
    useEffect(() => {
        loadEntities();
    }, [loadEntities]);
}
