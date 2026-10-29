import AsyncStorage from '@react-native-async-storage/async-storage';
import { ILogger } from '@domain/logger';
import { IStorage, StorageLoadReturn, StorageSaveReturn } from '@domain/storage';

export class MobileStorage implements IStorage {
    constructor (
        private readonly logger: ILogger
    ) { }

    async save<T> (name: string, data: T): Promise<StorageSaveReturn> {
        this.logger.info('Executing MobileStorage::save');
        this.logger.storage('Executing MobileStorage::save - data', data);

        try {
            await AsyncStorage.setItem(name, JSON.stringify(data));
            return { success: true };
        } catch (error) {
            this.logger.error(`Error on MobileStorage::save - ${name}`, error);
            return { success: false, error: `Failed to save ${name}` };
        }
    }

    async load<T> (name: string): Promise<StorageLoadReturn<T>> {
        this.logger.info('Executing MobileStorage::load');
        this.logger.debug('Executing MobileStorage::load - name', name);

        try {
            const data = await AsyncStorage.getItem(name);
            return { success: true, data: data ? JSON.parse(data) : null };
        } catch (error) {
            this.logger.error(`Error on MobileStorage::load - ${name}`, error);
            return { success: false, error: `Failed to load ${name}` };
        }
    }
}
