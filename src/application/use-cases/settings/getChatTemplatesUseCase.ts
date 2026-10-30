import { CHAT_TEMPLATE_DEFINITIONS } from '@domain/constants/textGeneration';
import { ChatTemplateKeyEnum, ChatTemplateOverrides, ChatTemplates } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ISettingsRepository } from '@domain/repository';
import { GetChatTemplatesUseCaseReturn, IGetChatTemplatesUseCase } from '@domain/use-cases';

export class GetChatTemplatesUseCase implements IGetChatTemplatesUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly settingsRepository: ISettingsRepository
    ) { }

    async execute (): Promise<GetChatTemplatesUseCaseReturn> {
        this.logger.info('Executing GetChatTemplatesUseCase::execute');

        const response = await this.settingsRepository.getSettings();
        if (!response.success || !response.settings) {
            this.logger.warning('GetChatTemplatesUseCase::execute - failed to load settings', response.error);
            return { success: false, error: response.error ?? 'Failed to load settings' };
        }

        const templates = this.applyOverrides(response.settings.chatTemplates ?? {});

        return { success: true, templates, definitions: CHAT_TEMPLATE_DEFINITIONS };
    }

    private applyOverrides (overrides: ChatTemplateOverrides): ChatTemplates {
        const entries = Object.values(ChatTemplateKeyEnum).map(key => [key, overrides[key] ?? CHAT_TEMPLATE_DEFINITIONS[key].defaultTemplate]);

        return Object.fromEntries(entries);
    }
}
