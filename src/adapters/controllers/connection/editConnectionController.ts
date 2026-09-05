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
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            connection: response.connection,
            error: response.error
        };
    }
}
