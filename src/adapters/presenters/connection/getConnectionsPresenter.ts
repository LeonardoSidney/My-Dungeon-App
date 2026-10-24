import type { Connection } from '@domain/entities';
import type { ConnectionListItem } from '@domain/controllers';
import { IGetConnectionsPresenter } from '@domain/presenters';

export class GetConnectionsPresenter implements IGetConnectionsPresenter {
    present (connections: Connection[]): ConnectionListItem[] {
        return connections.map(connection => ({ id: connection.id, name: connection.name, ip: connection.ip, port: connection.port }));
    }
}
