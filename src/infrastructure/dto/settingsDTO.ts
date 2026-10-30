import { ChatTemplateKeyEnum, ChatTemplateOverrides, Settings } from '@domain/entities';
import { isRecord } from './shared';

export class SettingsDTO {
    constructor (
        private readonly systemPromptLoadOrder?: string,
        private readonly showThinkBlocks?: boolean,
        private readonly chatTemplates?: Record<string, string>
    ) { }

    toEntity (): Settings {
        const settings: Settings = {};

        if (this.systemPromptLoadOrder !== undefined) {
            settings.systemPromptLoadOrder = this.systemPromptLoadOrder;
        }

        if (this.showThinkBlocks !== undefined) {
            settings.showThinkBlocks = this.showThinkBlocks;
        }

        if (this.chatTemplates !== undefined) {
            settings.chatTemplates = this.toChatTemplateOverrides(this.chatTemplates);
        }

        return settings;
    }

    private toChatTemplateOverrides (chatTemplates: Record<string, string>): ChatTemplateOverrides {
        const overrides: ChatTemplateOverrides = {};

        for (const key of Object.values(ChatTemplateKeyEnum)) {
            const template = chatTemplates[key];
            if (template !== undefined) {
                overrides[key] = template;
            }
        }

        return overrides;
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

        if (data.chatTemplates !== undefined && !SettingsDTO.isChatTemplates(data.chatTemplates)) {
            return null;
        }

        return new SettingsDTO(data.systemPromptLoadOrder, data.showThinkBlocks, data.chatTemplates);
    }

    private static isChatTemplates (data: unknown): data is Record<string, string> {
        if (!isRecord(data) || Array.isArray(data)) {
            return false;
        }

        return Object.values(data).every(template => typeof template === 'string');
    }
}
