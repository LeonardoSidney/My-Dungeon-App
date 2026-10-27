import {
    EditConnectionControllerParams,
    EditConnectionControllerResponse,
    IEditConnectionController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditConnectionUseCase } from '@domain/use-cases';

export class EditConnectionController implements IEditConnectionController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditConnectionUseCase
    ) { }

    async handle (params: EditConnectionControllerParams): Promise<EditConnectionControllerResponse> {
        this.logger.info('Executing EditConnectionController::handle');
        this.logger.debug('EditConnectionController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            id: response.id,
            error: response.error,
        };
    }
}
