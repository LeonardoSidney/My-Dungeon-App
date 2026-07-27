import { getConnectionsController } from '@infra/container';
import { Connection } from '@domain/entities';

export async function loadConnections (): Promise<Connection[]> {
    try {
        const ctrl = getConnectionsController();
        return await ctrl.handle();
    } catch (error) {
        console.error('Failed to load connections:', error);
        return [];
    }
}
