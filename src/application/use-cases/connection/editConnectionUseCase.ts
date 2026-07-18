import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import { IEditConnectionConfigService } from '@domain/services';
import { EditConnectionParams, EditConnectionReturn, IEditConnectionUseCase } from '@domain/use-cases';

export class EditConnectionUseCase implements IEditConnectionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditConnectionConfigService,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    async execute (params: EditConnectionParams): Promise<EditConnectionReturn> {
        this.logger.info('Executing EditConnectionUseCase::execute');
        this.validate(params);

        const { id, name, ip, port, auth, createdAt } = params;

        this.logger.debug('Calling EditConnectionConfigService', { id, name, ip, port, auth, createdAt });
        const response = this.service.editConnectionConfig({ id, name, ip, port, auth, createdAt });
        this.logger.debug('EditConnectionConfigService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                connection: undefined,
                error: response.error || 'An unknown error occurred on EditConnectionConfigService'
            };
        }

        if (!response.connection) {
            return {
                success: false,
                connection: undefined,
                error: 'Success is true but does not have a connection'
            };
        }

        const editedConnection = response.connection;
        const connections = await this.connectionRepository.getConnections();
        const alreadyExists = connections.some((c) => c.name === editedConnection.name && c.id !== editedConnection.id);

        if (alreadyExists) {
            this.logger.warning(`Connection with name ${editedConnection.name} already exists`);
            return {
                success: false,
                connection: undefined,
                error: `Connection with name ${editedConnection.name} already exists`
            };
        }

        const editResult = await this.connectionRepository.editConnection({ connection: editedConnection });
        if (!editResult.success) {
            return {
                success: false,
                connection: undefined,
                error: editResult.error || 'Failed to edit connection'
            };
        }

        return {
            connection: editedConnection,
            success: true
        };
    }

    private validate (params: EditConnectionParams): void {
        if (!params.id) {
            throw new Error('An id is required to edit a connection config');
        }

        if (!params.name?.trim()) {
            throw new Error('A name is required to edit a connection config');
        }

        if (!params.ip?.trim()) {
            throw new Error('An IP is required to edit a connection config');
        }

        if (params.port && params.port <= 0) {
            throw new Error('A valid port is required to edit a connection config');
        }
    }
}
