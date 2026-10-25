import { DEFAULT_TEXT_ADVENTURE_TEMPLATE } from '@domain/constants/textGeneration';
import { ILogger } from '@domain/logger';
import { ISettingsRepository } from '@domain/repository';
import { IResetSystemPromptLoadOrderUseCase, ResetSystemPromptLoadOrderUseCaseReturn } from '@domain/use-cases';

export class ResetSystemPromptLoadOrderUseCase implements IResetSystemPromptLoadOrderUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly settingsRepository: ISettingsRepository
    ) { }

    async execute (): Promise<ResetSystemPromptLoadOrderUseCaseReturn> {
        this.logger.info('Executing ResetSystemPromptLoadOrderUseCase::execute');

        const loaded = await this.settingsRepository.getSettings();
        if (!loaded.success || !loaded.settings) {
            this.logger.warning('ResetSystemPromptLoadOrderUseCase::execute - failed to load settings', loaded.error);
            return { success: false, error: loaded.error ?? 'Failed to load settings' };
        }

        const settings = { ...loaded.settings };
        delete settings.systemPromptLoadOrder;

        const saved = await this.settingsRepository.saveSettings({ settings });
        if (!saved.success) {
            this.logger.error('ResetSystemPromptLoadOrderUseCase::execute - failed to save settings', saved.error);
            return { success: false, error: saved.error };
        }

        return { success: true, loadOrder: DEFAULT_TEXT_ADVENTURE_TEMPLATE };
    }
}
