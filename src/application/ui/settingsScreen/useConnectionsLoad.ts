import { useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Connection } from '@domain/entities';
import { loadConnections } from './loadConnections';

export function useConnectionsLoad (
    setConnections: Dispatch<SetStateAction<Connection[]>>
) {
    useEffect(() => {
        loadConnections(setConnections);
    }, [setConnections]);
}
