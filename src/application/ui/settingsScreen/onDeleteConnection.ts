import { Connection } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseConnectionController } from '@infra/container';
import { loadConnections } from './loadConnections';

export async function onDeleteConnection (
    connectionId: string,
    setConnections: Dispatch<SetStateAction<Connection[]>>
) {
    try {
        const ctrl = eraseConnectionController();
        await ctrl.handle(connectionId);
        await loadConnections(setConnections);
    } catch (error) {
        console.error('Failed to delete connection:', error);
    }
}
