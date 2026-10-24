import type { Connection } from '@domain/entities';
import type { ConnectionDetails } from '@domain/controllers';
import { IGetConnectionPresenter } from '@domain/presenters';

export class GetConnectionPresenter implements IGetConnectionPresenter {
    present (connection: Connection): ConnectionDetails {
        return {
            id: connection.id,
            name: connection.name,
            ip: connection.ip,
            port: connection.port,
            auth: connection.auth,
        };
    }
}
