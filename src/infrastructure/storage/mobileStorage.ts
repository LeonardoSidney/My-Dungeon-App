import AsyncStorage from '@react-native-async-storage/async-storage';
import { ILogger } from '../../domain/logger';
import { IStorage } from '../../domain/storage';

export class MobileStorage implements IStorage {
    constructor(
        private readonly logger: ILogger
    ) { }

    public async save<T>(name: string, data: T): Promise<void> {
        this.logger.info("Executing MobileStorag::save");
        try {
            const dataToSave = [data];
            const dataSaved = await this.load<T[]>(name);
            this.logger.debug("Executing MobileStorag::save - dataSaved: ", dataSaved);

            if (dataSaved) {
                dataToSave.push(...dataSaved);
            }

            this.logger.debug("Executing MobileStorag::save - dataToSave: ", dataToSave);

            await AsyncStorage.setItem(name, JSON.stringify(dataToSave));
        } catch (error) {
            throw error;
        }
    }

    public async load<T>(name: string): Promise<T | null> {
        this.logger.info("Executing MobileStorage::load");
        this.logger.debug("Executing MobileStorage::load - name", name);

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
