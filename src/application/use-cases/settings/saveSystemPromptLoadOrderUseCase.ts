import { ILogger } from '@domain/logger';
import { ISettingsRepository } from '@domain/repository';
import { IValidateSystemPromptLoadOrderService } from '@domain/services';
import {
    ISaveSystemPromptLoadOrderUseCase,
    SaveSystemPromptLoadOrderUseCaseParams,
    SaveSystemPromptLoadOrderUseCaseReturn,
} from '@domain/use-cases';

export class SaveSystemPromptLoadOrderUseCase implements ISaveSystemPromptLoadOrderUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly settingsRepository: ISettingsRepository,
        private readonly validateSystemPromptLoadOrderService: IValidateSystemPromptLoadOrderService
    ) { }

    async execute (params: SaveSystemPromptLoadOrderUseCaseParams): Promise<SaveSystemPromptLoadOrderUseCaseReturn> {
        this.logger.info('Executing SaveSystemPromptLoadOrderUseCase::execute');
        this.logger.debug('SaveSystemPromptLoadOrderUseCase::execute - params', params);

        if (typeof params.loadOrder !== 'string') {
            return { success: false, error: 'System prompt load order is required' };
        }

        const validated = this.validateSystemPromptLoadOrderService.validate({ loadOrder: params.loadOrder });
        if (!validated.success || validated.loadOrder === undefined) {
            return { success: false, error: validated.error ?? 'Invalid system prompt load order' };
        }

        const loadOrder = validated.loadOrder;

        const loaded = await this.settingsRepository.getSettings();
        if (!loaded.success || !loaded.settings) {
            this.logger.warning('SaveSystemPromptLoadOrderUseCase::execute - failed to load settings', loaded.error);
            return { success: false, error: loaded.error ?? 'Failed to load settings' };
        }

        const saved = await this.settingsRepository.saveSettings({ settings: { ...loaded.settings, systemPromptLoadOrder: loadOrder } });
        if (!saved.success) {
            this.logger.error('SaveSystemPromptLoadOrderUseCase::execute - failed to save settings', saved.error);
            return { success: false, error: saved.error };
        }

        return { success: true, loadOrder };
    }
}
