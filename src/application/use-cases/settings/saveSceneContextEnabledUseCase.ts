import { ILogger } from '@domain/logger';
import { ISettingsRepository } from '@domain/repository';
import {
    ISaveSceneContextEnabledUseCase,
    SaveSceneContextEnabledUseCaseParams,
    SaveSceneContextEnabledUseCaseReturn,
} from '@domain/use-cases';

export class SaveSceneContextEnabledUseCase implements ISaveSceneContextEnabledUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly settingsRepository: ISettingsRepository
    ) { }

    async execute (params: SaveSceneContextEnabledUseCaseParams): Promise<SaveSceneContextEnabledUseCaseReturn> {
        this.logger.info('Executing SaveSceneContextEnabledUseCase::execute');
        this.logger.debug('SaveSceneContextEnabledUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const loaded = await this.settingsRepository.getSettings();
        if (!loaded.success || !loaded.settings) {
            this.logger.warning('SaveSceneContextEnabledUseCase::execute - failed to load settings', loaded.error);
            return { success: false, error: loaded.error ?? 'Failed to load settings' };
        }

        const settings = { ...loaded.settings, sceneContextEnabled: params.sceneContextEnabled };
        const saved = await this.settingsRepository.saveSettings({ settings });
        if (!saved.success) {
            this.logger.error('SaveSceneContextEnabledUseCase::execute - failed to save settings', saved.error);
            return { success: false, error: saved.error };
        }

        return { success: true, sceneContextEnabled: params.sceneContextEnabled };
    }

    private validate (params: SaveSceneContextEnabledUseCaseParams): string | null {
        if (typeof params.sceneContextEnabled !== 'boolean') {
            return 'Scene context setting is required';
        }

        return null;
    }
}
