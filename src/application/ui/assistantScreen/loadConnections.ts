import { IGetConnectionsController } from '@domain/controllers';
import { Connection } from '@domain/entities';

export async function loadConnections (
    getConnections: IGetConnectionsController
): Promise<Connection[]> {
    try {
        return await getConnections.handle();
    } catch (error) {
        console.error('Failed to load connections:', error);
        return [];
    }
}
