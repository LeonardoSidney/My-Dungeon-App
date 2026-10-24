import {
    EditStatusControllerParams,
    EditStatusControllerResponse,
    IEditStatusController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditStatusUseCase } from '@domain/use-cases';

export class EditStatusController implements IEditStatusController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditStatusUseCase
    ) { }
    async handle (params: EditStatusControllerParams): Promise<EditStatusControllerResponse> {
        this.logger.info('Executing EditStatusController::handle');
        this.logger.debug('EditStatusController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            id: response.id,
            error: response.error,
        };
    }
}
