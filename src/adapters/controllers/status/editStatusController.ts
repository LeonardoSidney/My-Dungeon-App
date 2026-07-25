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
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            status: response.status,
            error: response.error
        };
    }
}
