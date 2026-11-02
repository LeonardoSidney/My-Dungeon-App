import { Connection } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditConnectionConfigServiceParams, EditConnectionConfigServiceReturn, IEditConnectionConfigService } from '@domain/services';

export class EditConnectionConfigService implements IEditConnectionConfigService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editConnectionConfig (params: EditConnectionConfigServiceParams): EditConnectionConfigServiceReturn {
        this.logger.info('Executing EditConnectionConfigService::editConnectionConfig');
        const { connection, editParams } = params;

        const editedConnection: Connection = {
            ...connection,
            name: editParams.name.trim(),
            ip: editParams.ip,
            port: editParams.port,
            auth: editParams.auth,
            updatedAt: new Date()
        };

        return {
            success: true,
            connection: editedConnection
        };
    }
}
