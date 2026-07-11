import { ILogger } from '@domain/logger';
import { CreateConnectionConfigServiceParams, CreateConnectionConfigServiceReturn, ICreateConnectionConfigService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';

export class CreateConnectionConfigService implements ICreateConnectionConfigService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerate: IIdGenerator
    ) { }
    createConnectionConfig(params: CreateConnectionConfigServiceParams): CreateConnectionConfigServiceReturn {
        this.logger.info('Executing CreateConnectionConfigService::createConnectionConfig');
        const { name, ip, port, auth } = params;
        const connection = {
            id: this.idGenerate.generate(),
            name,
            ip,
            port,
            auth,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return {
            success: true,
            connection
        };
    }
}
