import {
    EraseAssistantControllerResponse,
    IEraseAssistantController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseAssistantUseCase } from '@domain/use-cases';

export class EraseAssistantController implements IEraseAssistantController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEraseAssistantUseCase
    ) { }

    async handle (assistantId: string): Promise<EraseAssistantControllerResponse> {
        this.logger.info('Executing EraseAssistantController::handle');
        const response = await this.useCase.execute(assistantId);

        return {
            success: response.success,
            error: response.error
        };
    }
}
