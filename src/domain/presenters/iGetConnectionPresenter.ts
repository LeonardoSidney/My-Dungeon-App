import type { Connection } from '../entities';
import type { ConnectionDetails } from '../controllers';

export interface IGetConnectionPresenter {
    present (connection: Connection): ConnectionDetails;
}
