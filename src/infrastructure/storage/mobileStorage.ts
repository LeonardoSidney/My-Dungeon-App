import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorage } from "./iStorage";
import { ILogger } from '../../domain/logger';

export class MobileStorage implements IStorage {
    constructor(
        private readonly logger: ILogger
    ) { }

    public async save<T>(name: string, data: T): Promise<void> {
        this.logger.info("Executing MobileStorage save");
        try {
            const dataToSave = [data];
            const dataSaved = await this.load<T[]>(name);
            this.logger.debug("Data saved before insert: ", dataSaved);

            if (dataSaved) {
                dataToSave.push(...dataSaved);
            }

            this.logger.debug("Data to be saved: ", dataToSave);

            await AsyncStorage.setItem(name, JSON.stringify(dataToSave));
        } catch (error) {
            throw error;
        }
    }

    public async load<T>(name: string): Promise<T | null> {
        this.logger.info("Executing MobileStorage load");
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
