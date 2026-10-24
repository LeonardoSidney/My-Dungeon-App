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
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const { id, editParams } = params;
        const connectionResponse = await this.connectionRepository.getConnectionById(id);
        if (!connectionResponse.success) {
            this.logger.warning('EditConnectionUseCase::execute - failed to load connection', connectionResponse.error);
            return { success: false, error: connectionResponse.error };
        }

        const connection = connectionResponse.connection;
        if (!connection) {
            return {
                success: false,
                error: `Connection with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditConnectionConfigService', { id, editParams });
        const response = this.service.editConnectionConfig({ connection, editParams });
        this.logger.debug('EditConnectionConfigService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditConnectionConfigService'
            };
        }

        if (!response.connection) {
            return {
                success: false,
                error: 'Success is true but does not have a connection'
            };
        }

        const editedConnection = response.connection;
        const connectionsResponse = await this.connectionRepository.getConnections();
        if (!connectionsResponse.success || !connectionsResponse.connections) {
            this.logger.warning('EditConnectionUseCase::execute - failed to load connections', connectionsResponse.error);
            return { success: false, error: connectionsResponse.error };
        }

        const connections = connectionsResponse.connections;
        const alreadyExists = connections.some((c) => c.name === editedConnection.name && c.id !== editedConnection.id);

        if (alreadyExists) {
            this.logger.warning(`Connection with name ${editedConnection.name} already exists`);
            return {
                success: false,
                error: `Connection with name ${editedConnection.name} already exists`
            };
        }

        const editResult = await this.connectionRepository.editConnection({ connection: editedConnection });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit connection'
            };
        }

        return {
            id: editedConnection.id,
            success: true
        };
    }

    private validate (params: EditConnectionParams): string | null {
        if (!params.id?.trim()) {
            return 'An id is required to edit a connection config';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit a connection config';
        }

        if (!params.editParams.ip?.trim()) {
            return 'An IP is required to edit a connection config';
        }

        if (params.editParams.port && params.editParams.port <= 0) {
            return 'A valid port is required to edit a connection config';
        }

        return null;
    }
}
