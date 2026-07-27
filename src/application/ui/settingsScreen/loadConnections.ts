import { getConnectionsController } from '@infra/container';
import { Dispatch } from 'react';
import { Connection } from '@domain/entities';

export async function loadConnections (
    setConnections: Dispatch<React.SetStateAction<Connection[]>>
) {
    try {
        const ctrl = getConnectionsController();
        const result = await ctrl.handle();
        setConnections(result);
    } catch (error) {
        console.error('Failed to load connections:', error);
    }
}
