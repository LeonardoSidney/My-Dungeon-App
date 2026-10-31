import { ILogger } from '@domain/logger';
import { ISettingsRepository } from '@domain/repository';
import {
    DEFAULT_SCENE_CONTEXT_ENABLED,
    GetSceneContextEnabledUseCaseReturn,
    IGetSceneContextEnabledUseCase,
} from '@domain/use-cases';

export class GetSceneContextEnabledUseCase implements IGetSceneContextEnabledUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly settingsRepository: ISettingsRepository
    ) { }

    async execute (): Promise<GetSceneContextEnabledUseCaseReturn> {
        this.logger.info('Executing GetSceneContextEnabledUseCase::execute');

        const response = await this.settingsRepository.getSettings();
        if (!response.success || !response.settings) {
            this.logger.warning('GetSceneContextEnabledUseCase::execute - failed to load settings', response.error);
            return { success: false, error: response.error ?? 'Failed to load settings' };
        }

        return { success: true, sceneContextEnabled: response.settings.sceneContextEnabled ?? DEFAULT_SCENE_CONTEXT_ENABLED };
    }
}
