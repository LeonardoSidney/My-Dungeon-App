import { CONNECTION_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Connection } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IConnectionRepository, SaveConnectionParams } from '@domain/repository';
import { IStorage } from '@domain/storage';

export class ConnectionRepository implements IConnectionRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

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
}
