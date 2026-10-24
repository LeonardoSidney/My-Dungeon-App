import { CONNECTION_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Connection } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IConnectionRepository,
    SaveConnectionParams,
    SaveConnectionRepositoryReturn,
    GetConnectionsRepositoryReturn,
    GetConnectionByIdRepositoryReturn,
    EditConnectionParams,
    EditConnectionRepositoryReturn,
    EraseConnectionRepositoryReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { ConnectionDTO } from '@infra/dto';

export class ConnectionRepository implements IConnectionRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`;
    }

    async saveConnection (params: SaveConnectionParams): Promise<SaveConnectionRepositoryReturn> {
        this.logger.info('Executing ConnectionRepository::saveConnection');
        this.logger.debug('Executing ConnectionRepository::saveConnection - params: ', params);

        const loaded = await this.storage.load<Connection[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ConnectionRepository::saveConnection - failed to load connections', loaded.error);
            return { success: false, error: 'Failed to save connection' };
        }

        const connections = [...(loaded.data ?? []), params.connection];
        const saved = await this.storage.save(this.storageKey, connections);
        if (!saved.success) {
            this.logger.warning('ConnectionRepository::saveConnection - failed to persist connections', saved.error);
            return { success: false, error: 'Failed to save connection' };
        }

        return { success: true };
    }

    async getConnectionById (connectionId: string): Promise<GetConnectionByIdRepositoryReturn> {
        this.logger.info('Executing ConnectionRepository::getConnectionById');

        const response = await this.getConnections();
        if (!response.success || !response.connections) {
            return { success: false, error: response.error };
        }

        return { success: true, connection: response.connections.find((c) => c.id === connectionId) };
    }

    async getConnections (): Promise<GetConnectionsRepositoryReturn> {
        this.logger.info('Executing ConnectionRepository::getConnections');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ConnectionRepository::getConnections - failed to load connections', loaded.error);
            return { success: false, error: 'Failed to load connections' };
        }

        const rawData = loaded.data ?? [];
        this.logger.debug('Executing ConnectionRepository::getConnections - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('ConnectionRepository::getConnections - stored connections are not a list');
            return { success: false, error: 'Failed to load connections' };
        }

        const connections: Connection[] = [];
        for (const connectionUnknown of rawData) {
            const dto = ConnectionDTO.fromStorage(connectionUnknown);
            if (dto) {
                connections.push(dto.toEntity());
            }
        }

        if (rawData.length !== connections.length) {
            this.logger.warning('Some connections were not converted to entity');
        }

        this.logger.debug('Executing ConnectionRepository::getConnections - connections: ', connections);
        return { success: true, connections };
    }

    async editConnection (params: EditConnectionParams): Promise<EditConnectionRepositoryReturn> {
        this.logger.info('Executing ConnectionRepository::editConnection');
        this.logger.debug('Executing ConnectionRepository::editConnection - params: ', params);

        const { connection } = params;
        const loaded = await this.storage.load<Connection[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ConnectionRepository::editConnection - failed to load connections', loaded.error);
            return { success: false, error: 'Failed to edit connection' };
        }

        const connections = loaded.data ?? [];
        const index = connections.findIndex((c) => c.id === connection.id);
        if (index === -1) {
            this.logger.warning(`Connection with id ${connection.id} not found`);
            return { success: false, error: `Connection with id ${connection.id} does not exist` };
        }

        connections[index] = connection;
        const saved = await this.storage.save(this.storageKey, connections);
        if (!saved.success) {
            this.logger.warning('ConnectionRepository::editConnection - failed to persist connections', saved.error);
            return { success: false, error: 'Failed to edit connection' };
        }

        return { success: true };
    }

    async eraseConnection (connectionId: string): Promise<EraseConnectionRepositoryReturn> {
        this.logger.info('Executing ConnectionRepository::eraseConnection');
        this.logger.debug('Executing ConnectionRepository::eraseConnection - connectionId: ', connectionId);

        const loaded = await this.storage.load<Connection[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ConnectionRepository::eraseConnection - failed to load connections', loaded.error);
            return { success: false, error: 'Failed to erase connection' };
        }

        const connections = loaded.data ?? [];
        const index = connections.findIndex((c) => c.id === connectionId);
        if (index === -1) {
            this.logger.warning(`Connection with id ${connectionId} not found`);
            return { success: false, error: `Connection with id ${connectionId} does not exist` };
        }

        connections.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, connections);
        if (!saved.success) {
            this.logger.warning('ConnectionRepository::eraseConnection - failed to persist connections', saved.error);
            return { success: false, error: 'Failed to erase connection' };
        }

        return { success: true };
    }
}
