import AsyncStorage from '@react-native-async-storage/async-storage';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';

export class MobileStorage implements IStorage {
    constructor (
        private readonly logger: ILogger
    ) { }

    async save<T> (name: string, data: T): Promise<void> {
        this.logger.info('Executing MobileStorage::save');
        this.logger.debug('Executing MobileStorage::save - data', data);
        try {
            await AsyncStorage.setItem(name, JSON.stringify(data));
        } catch (error) {
            this.logger.error('Error on MobileStorage::save', error);
            throw error;
        }
    }

    async load<T> (name: string): Promise<T | null> {
        this.logger.info('Executing MobileStorage::load');
        this.logger.debug('Executing MobileStorage::load - name', name);

        try {
            const data = await AsyncStorage.getItem(name);

            if (data) {
                return JSON.parse(data);
            }

            return null;
        } catch (error) {
            throw error;
        }
    }
}
