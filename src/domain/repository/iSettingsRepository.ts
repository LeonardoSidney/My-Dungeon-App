import { Settings } from '../entities';

export interface ISettingsRepository {
    getSettings (): Promise<GetSettingsRepositoryReturn>;
    saveSettings (params: SaveSettingsParams): Promise<SaveSettingsRepositoryReturn>;
}

export type GetSettingsRepositoryReturn = {
    success: boolean;
    settings?: Settings;
    error?: string;
};

export type SaveSettingsParams = {
    settings: Settings;
};

export type SaveSettingsRepositoryReturn = {
    success: boolean;
    error?: string;
};
