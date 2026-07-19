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
        const response = await this.useCase.execute(params);

        return {
            success: response.success,
            assistant: response.assistant,
            error: response.error
        };
    }
}
