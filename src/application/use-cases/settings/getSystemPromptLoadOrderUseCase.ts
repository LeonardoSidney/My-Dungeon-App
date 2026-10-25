import { DEFAULT_TEXT_ADVENTURE_TEMPLATE } from '@domain/constants/textGeneration';
import { ILogger } from '@domain/logger';
import { ISettingsRepository } from '@domain/repository';
import { GetSystemPromptLoadOrderUseCaseReturn, IGetSystemPromptLoadOrderUseCase } from '@domain/use-cases';

export class GetSystemPromptLoadOrderUseCase implements IGetSystemPromptLoadOrderUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly settingsRepository: ISettingsRepository
    ) { }

    async execute (): Promise<GetSystemPromptLoadOrderUseCaseReturn> {
        this.logger.info('Executing GetSystemPromptLoadOrderUseCase::execute');

        const response = await this.settingsRepository.getSettings();
        if (!response.success || !response.settings) {
            this.logger.warning('GetSystemPromptLoadOrderUseCase::execute - failed to load settings', response.error);
            return { success: false, error: response.error ?? 'Failed to load settings' };
        }

        return { success: true, loadOrder: response.settings.systemPromptLoadOrder ?? DEFAULT_TEXT_ADVENTURE_TEMPLATE };
    }
}
