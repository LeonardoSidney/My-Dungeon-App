import { SETTINGS_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { ILogger } from '@domain/logger';
import {
    GetSettingsRepositoryReturn,
    ISettingsRepository,
    SaveSettingsParams,
    SaveSettingsRepositoryReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { SettingsDTO } from '../dto';

export class SettingsRepository implements ISettingsRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${SETTINGS_STORAGE_NAMESPACE}`;
    }

    async getSettings (): Promise<GetSettingsRepositoryReturn> {
        this.logger.info('Executing SettingsRepository::getSettings');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('SettingsRepository::getSettings - failed to load settings', loaded.error);
            return { success: false, error: 'Failed to load settings' };
        }

        if (loaded.data === null || loaded.data === undefined) {
            return { success: true, settings: {} };
        }

        const settings = SettingsDTO.fromStorage(loaded.data);
        if (!settings) {
            this.logger.warning('SettingsRepository::getSettings - stored settings are invalid, using the defaults');
            return { success: true, settings: {} };
        }

        return { success: true, settings: settings.toEntity() };
    }

    async saveSettings (params: SaveSettingsParams): Promise<SaveSettingsRepositoryReturn> {
        this.logger.info('Executing SettingsRepository::saveSettings');

        const saved = await this.storage.save(this.storageKey, params.settings);
        if (!saved.success) {
            this.logger.warning('SettingsRepository::saveSettings - failed to persist settings', saved.error);
            return { success: false, error: 'Failed to save settings' };
        }

        return { success: true };
    }
}
