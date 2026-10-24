import {
    EditAssistantControllerParams,
    EditAssistantControllerResponse,
    IEditAssistantController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditAssistantUseCase } from '@domain/use-cases';

export class EditAssistantController implements IEditAssistantController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditAssistantUseCase
    ) { }

    async handle (params: EditAssistantControllerParams): Promise<EditAssistantControllerResponse> {
        this.logger.info('Executing EditAssistantController::handle');
        this.logger.debug('EditAssistantController::handle - params', params);
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            id: response.id,
            error: response.error,
        };
    }
}
