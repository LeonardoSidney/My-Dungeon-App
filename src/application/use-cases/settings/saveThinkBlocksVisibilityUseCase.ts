import { ILogger } from '@domain/logger';
import { ISettingsRepository } from '@domain/repository';
import {
    ISaveThinkBlocksVisibilityUseCase,
    SaveThinkBlocksVisibilityUseCaseParams,
    SaveThinkBlocksVisibilityUseCaseReturn,
} from '@domain/use-cases';

export class SaveThinkBlocksVisibilityUseCase implements ISaveThinkBlocksVisibilityUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly settingsRepository: ISettingsRepository
    ) { }

    async execute (params: SaveThinkBlocksVisibilityUseCaseParams): Promise<SaveThinkBlocksVisibilityUseCaseReturn> {
        this.logger.info('Executing SaveThinkBlocksVisibilityUseCase::execute');
        this.logger.debug('SaveThinkBlocksVisibilityUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const loaded = await this.settingsRepository.getSettings();
        if (!loaded.success || !loaded.settings) {
            this.logger.warning('SaveThinkBlocksVisibilityUseCase::execute - failed to load settings', loaded.error);
            return { success: false, error: loaded.error ?? 'Failed to load settings' };
        }

        const settings = { ...loaded.settings, showThinkBlocks: params.showThinkBlocks };
        const saved = await this.settingsRepository.saveSettings({ settings });
        if (!saved.success) {
            this.logger.error('SaveThinkBlocksVisibilityUseCase::execute - failed to save settings', saved.error);
            return { success: false, error: saved.error };
        }

        return { success: true, showThinkBlocks: params.showThinkBlocks };
    }

    private validate (params: SaveThinkBlocksVisibilityUseCaseParams): string | null {
        if (typeof params.showThinkBlocks !== 'boolean') {
            return 'Think blocks visibility is required';
        }

        return null;
    }
}
