import {
    ApplyAdventureSettingsControllerParams,
    ApplyAdventureSettingsControllerResponse,
    IApplyAdventureSettingsController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IApplyAdventureSettingsUseCase } from '@domain/use-cases';

export class ApplyAdventureSettingsController implements IApplyAdventureSettingsController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IApplyAdventureSettingsUseCase
    ) { }

    async handle (params: ApplyAdventureSettingsControllerParams): Promise<ApplyAdventureSettingsControllerResponse> {
        this.logger.info('Executing ApplyAdventureSettingsController::handle');
        this.logger.debug('ApplyAdventureSettingsController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            error: response.error,
        };
    }
}
