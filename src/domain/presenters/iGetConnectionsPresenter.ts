import type { Connection } from '../entities';
import type { ConnectionListItem } from '../controllers';

export interface IGetConnectionsPresenter {
    present (connections: Connection[]): ConnectionListItem[];
}
