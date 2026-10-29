import { Settings } from '@domain/entities';
import { isRecord } from './shared';

export class SettingsDTO {
    constructor (
        private readonly systemPromptLoadOrder?: string,
        private readonly showThinkBlocks?: boolean
    ) { }

    toEntity (): Settings {
        const settings: Settings = {};

        if (this.systemPromptLoadOrder !== undefined) {
            settings.systemPromptLoadOrder = this.systemPromptLoadOrder;
        }

        if (this.showThinkBlocks !== undefined) {
            settings.showThinkBlocks = this.showThinkBlocks;
        }

        return settings;
    }

    static fromStorage (data: unknown): SettingsDTO | null {
        if (!isRecord(data) || Array.isArray(data)) {
            return null;
        }

        if (data.systemPromptLoadOrder !== undefined && typeof data.systemPromptLoadOrder !== 'string') {
            return null;
        }

        if (data.showThinkBlocks !== undefined && typeof data.showThinkBlocks !== 'boolean') {
            return null;
        }

        return new SettingsDTO(data.systemPromptLoadOrder, data.showThinkBlocks);
    }
}
