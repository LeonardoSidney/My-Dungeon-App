import { ILogger } from '@domain/logger';
import { ISettingsRepository } from '@domain/repository';
import {
    DEFAULT_SHOW_THINK_BLOCKS,
    GetThinkBlocksVisibilityUseCaseReturn,
    IGetThinkBlocksVisibilityUseCase,
} from '@domain/use-cases';

export class GetThinkBlocksVisibilityUseCase implements IGetThinkBlocksVisibilityUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly settingsRepository: ISettingsRepository
    ) { }

    async execute (): Promise<GetThinkBlocksVisibilityUseCaseReturn> {
        this.logger.info('Executing GetThinkBlocksVisibilityUseCase::execute');

        const response = await this.settingsRepository.getSettings();
        if (!response.success || !response.settings) {
            this.logger.warning('GetThinkBlocksVisibilityUseCase::execute - failed to load settings', response.error);
            return { success: false, error: response.error ?? 'Failed to load settings' };
        }

        return { success: true, showThinkBlocks: response.settings.showThinkBlocks ?? DEFAULT_SHOW_THINK_BLOCKS };
    }
}
