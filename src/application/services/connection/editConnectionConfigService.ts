import { ILogger } from '@domain/logger';
import { EditConnectionConfigServiceParams, EditConnectionConfigServiceReturn, IEditConnectionConfigService } from '@domain/services';

export class EditConnectionConfigService implements IEditConnectionConfigService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editConnectionConfig (params: EditConnectionConfigServiceParams): EditConnectionConfigServiceReturn {
        this.logger.info('Executing EditConnectionConfigService::editConnectionConfig');
        const { id, name, ip, port, auth, createdAt } = params;

        const connection = {
            id,
            name,
            ip,
            port,
            auth,
            createdAt: createdAt,
            updatedAt: new Date()
        };

        return {
            success: true,
            connection
        };
    }
}
