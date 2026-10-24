import {
    EraseAssistantControllerResponse,
    IEraseAssistantController,
    EraseAssistantControllerRequest,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEraseAssistantUseCase } from '@domain/use-cases';

export class EraseAssistantController implements IEraseAssistantController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEraseAssistantUseCase
    ) { }

    async handle (request: EraseAssistantControllerRequest): Promise<EraseAssistantControllerResponse> {
        this.logger.info('Executing EraseAssistantController::handle');
        this.logger.debug('EraseAssistantController::handle - params', request);
        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            error: response.error
        };
    }
}
