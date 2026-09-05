import {
    EditWorldMasterControllerParams,
    EditWorldMasterControllerResponse,
    IEditWorldMasterController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditWorldMasterUseCase } from '@domain/use-cases';

export class EditWorldMasterController implements IEditWorldMasterController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditWorldMasterUseCase
    ) { }

    async handle (params: EditWorldMasterControllerParams): Promise<EditWorldMasterControllerResponse> {
        this.logger.info('Executing EditWorldMasterController::handle');
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            worldMaster: response.worldMaster,
            error: response.error
        };
    }
}
