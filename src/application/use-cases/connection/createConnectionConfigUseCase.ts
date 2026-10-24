import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import { ICreateConnectionConfigService } from '@domain/services';
import { CreateConnectionConfigParams, CreateConnectionConfigReturn, ICreateConnectionConfigUseCase } from '@domain/use-cases';

export class CreateConnectionConfigUseCase implements ICreateConnectionConfigUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: ICreateConnectionConfigService,
        private readonly connectionRepository: IConnectionRepository
    ) { }
    async execute (params: CreateConnectionConfigParams): Promise<CreateConnectionConfigReturn> {
        this.logger.info('Executing CreateConnectionConfigUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }
        const { name, ip, port, auth } = params;
        const createParams = {
            name,
            ip,
            port,
            auth
        };
        this.logger.debug('Calling CreateConnectionConfigService', createParams);
        const response = this.service.createConnectionConfig(createParams);
        this.logger.debug('CreateConnectionConfigService executed successfully', response);
        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on CreateConnectionConfigService'
            };
        }

        if (!response.connection) {
            return {
                success: false,
                error: 'Success is true but does not have an connection'
            };
        }

        const connectionsResponse = await this.connectionRepository.getConnections();
        if (!connectionsResponse.success || !connectionsResponse.connections) {
            this.logger.warning('CreateConnectionConfigUseCase::execute - failed to load connections', connectionsResponse.error);
            return { success: false, error: connectionsResponse.error };
        }

        const connections = connectionsResponse.connections;
        this.logger.debug('ConnectionRepository executed successfully', connections);
        const alreadyExists = connections.find((c) => c.name === response.connection?.name);

        if (alreadyExists) {
            this.logger.warning(`Connection with name ${response.connection.name} already exists`);
            return {
                success: false,
                error: `Connection with name ${response.connection.name} already exists`
            };
        }

        const saveResult = await this.connectionRepository.saveConnection({ connection: response.connection });
        if (!saveResult.success) {
            this.logger.warning('CreateConnectionConfigUseCase::execute - failed to save connection', saveResult.error);
            return { success: false, error: saveResult.error };
        }

        return {
            id: response.connection.id,
            success: true
        };
    }

    private validate (params: CreateConnectionConfigParams): string | null {
        if (!params.name?.trim()) {
            return 'A name is required to create a connection config';
        }

        if (!params.ip?.trim()) {
            return 'An IP is required to create a connection config';
        }

        if (params.port && params.port <= 0) {
            return 'A valid port is required to create a connection config';
        }

        return null;
    }
}
