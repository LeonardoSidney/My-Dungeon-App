import AsyncStorage from '@react-native-async-storage/async-storage';
import { ILogger } from '@domain/logger';
import {
    IStorage,
    StorageLoadManyReturn,
    StorageLoadReturn,
    StorageRemoveReturn,
    StorageSaveReturn,
} from '@domain/storage';

export class MobileStorage implements IStorage {
    constructor (
        private readonly logger: ILogger
    ) { }

    async save<T> (name: string, data: T): Promise<StorageSaveReturn> {
        this.logger.info('Executing MobileStorage::save');
        this.logger.storage('Executing MobileStorage::save - data', data);

        try {
            const startedAt = Date.now();
            const serialized = JSON.stringify(data);
            await AsyncStorage.setItem(name, serialized);
            this.logMeasurement('save', name, serialized.length, startedAt);
            return { success: true };
        } catch (error) {
            this.logger.error(`Error on MobileStorage::save - ${name}`, error);
            return { success: false, error: `Failed to save ${name}` };
        }
    }

    async saveMany (entries: Record<string, unknown>): Promise<StorageSaveReturn> {
        this.logger.info('Executing MobileStorage::saveMany');
        this.logger.storage('Executing MobileStorage::saveMany - entries', entries);

        const names = Object.keys(entries).join(', ');

        try {
            const startedAt = Date.now();
            const serializedEntries: Record<string, string> = {};
            let size = 0;
            for (const [name, data] of Object.entries(entries)) {
                const serialized = JSON.stringify(data);
                serializedEntries[name] = serialized;
                size += serialized.length;
            }

            await AsyncStorage.setMany(serializedEntries);
            this.logMeasurement('saveMany', names, size, startedAt);
            return { success: true };
        } catch (error) {
            this.logger.error(`Error on MobileStorage::saveMany - ${names}`, error);
            return { success: false, error: `Failed to save ${names}` };
        }
    }

    async load<T> (name: string): Promise<StorageLoadReturn<T>> {
        this.logger.info('Executing MobileStorage::load');
        this.logger.debug('Executing MobileStorage::load - name', name);

        try {
            const startedAt = Date.now();
            const serialized = await AsyncStorage.getItem(name);
            const data = serialized ? JSON.parse(serialized) : null;
            this.logMeasurement('load', name, serialized?.length ?? 0, startedAt);
            return { success: true, data };
        } catch (error) {
            this.logger.error(`Error on MobileStorage::load - ${name}`, error);
            return { success: false, error: `Failed to load ${name}` };
        }
    }

    async loadMany<T> (names: string[]): Promise<StorageLoadManyReturn<T>> {
        this.logger.info('Executing MobileStorage::loadMany');
        this.logger.debug('Executing MobileStorage::loadMany - names', names);

        try {
            const startedAt = Date.now();
            const stored = await AsyncStorage.getMany(names);
            const data: Record<string, T | null> = {};
            let size = 0;
            for (const name of names) {
                const serialized = stored[name];
                data[name] = this.parseOrNull<T>(name, serialized);
                size += serialized?.length ?? 0;
            }

            this.logMeasurement('loadMany', names.join(', '), size, startedAt);
            return { success: true, data };
        } catch (error) {
            this.logger.error(`Error on MobileStorage::loadMany - ${names.join(', ')}`, error);
            return { success: false, error: `Failed to load ${names.join(', ')}` };
        }
    }

    async remove (name: string): Promise<StorageRemoveReturn> {
        this.logger.info('Executing MobileStorage::remove');
        this.logger.debug('Executing MobileStorage::remove - name', name);

        try {
            await AsyncStorage.removeItem(name);
            return { success: true };
        } catch (error) {
            this.logger.error(`Error on MobileStorage::remove - ${name}`, error);
            return { success: false, error: `Failed to remove ${name}` };
        }
    }

    async removeMany (names: string[]): Promise<StorageRemoveReturn> {
        this.logger.info('Executing MobileStorage::removeMany');
        this.logger.debug('Executing MobileStorage::removeMany - names', names);

        try {
            await AsyncStorage.removeMany(names);
            return { success: true };
        } catch (error) {
            this.logger.error(`Error on MobileStorage::removeMany - ${names.join(', ')}`, error);
            return { success: false, error: `Failed to remove ${names.join(', ')}` };
        }
    }

    private parseOrNull<T> (name: string, serialized: string | null | undefined): T | null {
        if (!serialized) {
            return null;
        }

        try {
            return JSON.parse(serialized);
        } catch (error) {
            this.logger.error(`Error on MobileStorage::parseOrNull - ${name}`, error);
            return null;
        }
    }

    private logMeasurement (operation: string, name: string, size: number, startedAt: number): void {
        this.logger.storage(`MobileStorage::${operation} - measurement`, { name, size, durationMs: Date.now() - startedAt });
    }
}
