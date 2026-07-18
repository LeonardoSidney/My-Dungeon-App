import { CONNECTION_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Connection } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IConnectionRepository, SaveConnectionParams, EditConnectionParams, EraseConnectionRepositoryReturn, EditConnectionRepositoryReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';

export class ConnectionRepository implements IConnectionRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findConnectionIndex(connections: Connection[], connectionId: string): Promise<number> {
        return connections.findIndex((c) => c.id === connectionId);
    }

    private removeAt(connections: Connection[], index: number): Connection[] {
        connections.splice(index, 1);
        return connections;
    }

    private replaceAt(connections: Connection[], index: number, newItem: Connection): Connection[] {
        connections[index] = newItem;
        return connections;
    }

    async saveConnection(params: SaveConnectionParams): Promise<boolean> {
        this.logger.info('Executing ConnectionRepository::saveConnection');
        this.logger.debug('Executing ConnectionRepository::saveConnection - params: ', params);

        try {
            const { connection } = params;
            const existingData = await this.storage.load<Connection[]>(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`);
            const connections: Connection[] = existingData ? [...existingData, connection] : [connection];
            await this.storage.save(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`, connections);
        } catch (error) {
            this.logger.error('Error on ConnectionRepository::saveConnection', error);
            throw error;
        }
        return true;
    }

    async getConnections(): Promise<Connection[]> {
        this.logger.info('Executing ConnectionRepository::getConnections');

        try {
            const connections = await this.storage.load<Connection[]>(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing ConnectionRepository::getConnections - connections: ', connections);
            return connections || [];
        } catch (error) {
            this.logger.error('Error on ConnectionRepository::getConnections', error);
            throw error;
        }
    }

    async eraseConnection(connectionId: string): Promise<EraseConnectionRepositoryReturn> {
        this.logger.info('Executing ConnectionRepository::eraseConnection');
        this.logger.debug('Executing ConnectionRepository::eraseConnection - connectionId: ', connectionId);

        try {
            const existingData = await this.storage.load<Connection[]>(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`);
            const connections = existingData || [];
            const index = await this.findConnectionIndex(connections, connectionId);

            if (index === -1) {
                this.logger.warning(`Connection with id ${connectionId} not found`);
                return { success: false, error: `Connection with id ${connectionId} does not exist` };
            }

            const filteredConnections = this.removeAt(connections, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`, filteredConnections);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on ConnectionRepository::eraseConnection', error);
            return { success: false, error: 'Failed to erase connection' };
        }
    }

    async editConnection(params: EditConnectionParams): Promise<EditConnectionRepositoryReturn> {
        this.logger.info('Executing ConnectionRepository::editConnection');
        this.logger.debug('Executing ConnectionRepository::editConnection - params: ', params);

        try {
            const { connection } = params;
            const existingData = await this.storage.load<Connection[]>(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`);
            const connections = existingData || [];
            const index = await this.findConnectionIndex(connections, connection.id);

            if (index === -1) {
                this.logger.warning(`Connection with id ${connection.id} not found`);
                return { success: false, error: `Connection with id ${connection.id} does not exist` };
            }

            const updatedConnections = this.replaceAt(connections, index, connection);
            await this.storage.save(`${STORAGE_NAMESPACE}/${CONNECTION_STORAGE_NAMESPACE}`, updatedConnections);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on ConnectionRepository::editConnection', error);
            return { success: false, error: 'Failed to edit connection' };
        }
    }
}
