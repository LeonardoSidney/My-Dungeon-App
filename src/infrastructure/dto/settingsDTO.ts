import { Settings } from '@domain/entities';
import { isRecord } from './shared';

export class SettingsDTO {
    constructor (
        private readonly systemPromptLoadOrder?: string
    ) { }

    toEntity (): Settings {
        if (this.systemPromptLoadOrder === undefined) {
            return {};
        }

        return { systemPromptLoadOrder: this.systemPromptLoadOrder };
    }

    static fromStorage (data: unknown): SettingsDTO | null {
        if (!isRecord(data) || Array.isArray(data)) {
            return null;
        }

        if (data.systemPromptLoadOrder !== undefined && typeof data.systemPromptLoadOrder !== 'string') {
            return null;
        }

        return new SettingsDTO(data.systemPromptLoadOrder);
    }
}
