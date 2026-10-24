import {
    EditCharacterControllerParams,
    EditCharacterControllerResponse,
    IEditCharacterController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditCharacterUseCase } from '@domain/use-cases';

export class EditCharacterController implements IEditCharacterController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditCharacterUseCase
    ) { }

    async handle (params: EditCharacterControllerParams): Promise<EditCharacterControllerResponse> {
        this.logger.info('Executing EditCharacterController::handle');
        this.logger.debug('EditCharacterController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            id: response.id,
            error: response.error,
        };
    }
}
