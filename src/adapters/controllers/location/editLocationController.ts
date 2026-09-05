import {
    EditLocationControllerParams,
    EditLocationControllerResponse,
    IEditLocationController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditLocationUseCase } from '@domain/use-cases';

export class EditLocationController implements IEditLocationController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditLocationUseCase
    ) { }

    async handle (params: EditLocationControllerParams): Promise<EditLocationControllerResponse> {
        this.logger.info('Executing EditLocationController::handle');
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            location: response.location,
            error: response.error
        };
    }
}
