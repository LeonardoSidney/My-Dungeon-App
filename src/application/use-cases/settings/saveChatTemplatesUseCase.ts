import { CHAT_TEMPLATE_DEFINITIONS } from '@domain/constants/textGeneration';
import { ChatTemplateKeyEnum, ChatTemplateOverrides, Settings } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ISettingsRepository } from '@domain/repository';
import { IValidateChatTemplatesService } from '@domain/services';
import {
    ISaveChatTemplatesUseCase,
    SaveChatTemplatesUseCaseParams,
    SaveChatTemplatesUseCaseReturn,
} from '@domain/use-cases';

export class SaveChatTemplatesUseCase implements ISaveChatTemplatesUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly settingsRepository: ISettingsRepository,
        private readonly validateChatTemplatesService: IValidateChatTemplatesService
    ) { }

    async execute (params: SaveChatTemplatesUseCaseParams): Promise<SaveChatTemplatesUseCaseReturn> {
        this.logger.info('Executing SaveChatTemplatesUseCase::execute');
        this.logger.debug('SaveChatTemplatesUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const validated = this.validateChatTemplatesService.validate({ templates: params.templates });
        if (!validated.success) {
            return { success: false, fieldErrors: validated.fieldErrors };
        }

        const loaded = await this.settingsRepository.getSettings();
        if (!loaded.success || !loaded.settings) {
            this.logger.warning('SaveChatTemplatesUseCase::execute - failed to load settings', loaded.error);
            return { success: false, error: loaded.error ?? 'Failed to load settings' };
        }

        const chatTemplates = this.mergeOverrides(loaded.settings.chatTemplates ?? {}, params.templates);
        const settings: Settings = { ...loaded.settings, chatTemplates };
        if (Object.keys(chatTemplates).length === 0) {
            delete settings.chatTemplates;
        }

        const saved = await this.settingsRepository.saveSettings({ settings });
        if (!saved.success) {
            this.logger.error('SaveChatTemplatesUseCase::execute - failed to save settings', saved.error);
            return { success: false, error: saved.error };
        }

        return { success: true };
    }

    private mergeOverrides (current: ChatTemplateOverrides, templates: ChatTemplateOverrides): ChatTemplateOverrides {
        const overrides = { ...current };

        for (const key of Object.values(ChatTemplateKeyEnum)) {
            const template = templates[key];
            if (template === undefined) {
                continue;
            }

            if (template === CHAT_TEMPLATE_DEFINITIONS[key].defaultTemplate) {
                delete overrides[key];
                continue;
            }

            overrides[key] = template;
        }

        return overrides;
    }

    private validate (params: SaveChatTemplatesUseCaseParams): string | null {
        if (!params.templates) {
            return 'Chat templates are required';
        }

        return null;
    }
}
