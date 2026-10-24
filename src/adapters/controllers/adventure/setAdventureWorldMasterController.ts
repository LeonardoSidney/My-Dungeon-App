import {
    ISetAdventureWorldMasterController,
    SetAdventureWorldMasterControllerParams,
    SetAdventureWorldMasterControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ISetAdventureWorldMasterUseCase } from '@domain/use-cases';

export class SetAdventureWorldMasterController implements ISetAdventureWorldMasterController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ISetAdventureWorldMasterUseCase
    ) { }

    async handle (params: SetAdventureWorldMasterControllerParams): Promise<SetAdventureWorldMasterControllerResponse> {
        this.logger.info('Executing SetAdventureWorldMasterController::handle');
        this.logger.debug('SetAdventureWorldMasterController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            error: response.error,
        };
    }
}
